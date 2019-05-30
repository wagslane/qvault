import fs from 'fs';
import { remote } from 'electron';
const dialog = remote.dialog;
const app = remote.app;
const pjson = require('../../package.json');
import { authenticate, isLoggedIn, setToken, getVaults, upsertVault } from '../lib/CloudClient/CloudClient';
import assert from '../lib/assert.es6';
import parse from 'csv-parse/lib/sync';
import {
  PassKeyFromPassword,
  CipherSecrets,
  DecipherSecrets,
  CipherCharKey,
  DecipherCharKey,
  HashCharKey,
  CipherSecretsQr,
  DecipherSecretsQr,
  DeriveCloudKey,
  HashCloudVault,
} from '../lib/QVaultCrypto/QVaultCrypto';

import secrets from './secrets.es6';

const QVAULT_FILE_EXTENSION = 'qvault';
const VERSION = pjson.version;
const FILE_FILTERS = [
  {
    name: 'Vaults',
    extensions: [
      QVAULT_FILE_EXTENSION,
    ],
  },
];

export default {
  mixins: [
    secrets,
  ],

  data(){
    return {
      hashed_char_key: null,
      char_key: null,
      qr_key: null,
      pass_key: null,
      qr_required: false,
      loaded_vault: null,
      local_vault_path: null,
      qr_secrets: null,
      email: null,
      encrypted_vault_size: 0,
      cloud_vault_hash: null,
    };
  },
  
  methods: {
    ResetStorageState(){
      this.hashed_char_key = null;
      this.char_key = null;
      this.qr_key = null;
      this.pass_key = null;
      this.qr_required = false;
      this.loaded_vault = null;
      this.local_vault_path = null;
      this.qr_secrets = null;
      this.email = null;
      this.encrypted_vault_size = 0;
    },

    ExistingVaultDialog(){
      let paths = dialog.showOpenDialog({
        filters: FILE_FILTERS
      });
      if (paths === undefined){
        return false;
      }
      assert(paths.length === 1, "Invalid number of paths selected");
      assert(paths[0], 'A vault file must be selected');
      this.LoadVault(paths[0]);
      return true;
    },

    ReadCSVDialogue(){
      let paths = dialog.showOpenDialog({
        filters: [
          {
            name: 'CSV',
            extensions: [
              'csv',
            ],
          },
        ]
      });
      if (paths === undefined){
        return [];
      }
      assert(paths.length === 1, "Invalid number of paths selected");
      assert(paths[0], 'A vault file must be selected');
      const data = fs.readFileSync(paths[0], 'utf-8');
      const parsed = parse(data, {
        columns: true,
        skip_empty_lines: true
      });
      assert(parsed.length > 0, "No password data found");
      assert(parsed[0].name !== undefined, "Invalid password format");
      assert(parsed[0].url !== undefined, "Invalid password format");
      assert(parsed[0].password !== undefined, "Invalid password format");
      assert(parsed[0].username !== undefined, "Invalid password format");
      return parsed;
    },

    LoadVault(vault_path){
      this.local_vault_path = vault_path;
      try {
        let data = fs.readFileSync(this.local_vault_path, 'utf-8');
        this.loaded_vault = JSON.parse(data);
        assert(this.loaded_vault.version, 'Selected vault is corrupted');
        this.email = this.loaded_vault.email;
        this.qr_required = this.loaded_vault.qr_required;
        this.encrypted_vault_size = Buffer.byteLength(JSON.stringify(this.loaded_vault));
      } catch (err) {
        this.loaded_vault  = null;
        this.local_vault_path = null;
        assert(false, err);
      }
    },

    NewVaultDialog(){
      this.local_vault_path = dialog.showSaveDialog({
        filters: FILE_FILTERS,
        defaultPath: `myvault.${QVAULT_FILE_EXTENSION}`
      });
      assert(this.local_vault_path, 'A vault file must be selected');
    },

    CreateQrKey(qrKey){
      this.qr_required = true;
      this.qr_key = qrKey;
    },

    async CreateLocalVault(){
      this.InitializeSecrets();
      await this.SaveLocalVault();
    },

    async UnlockVaultQr(qrKey){
      assert(this.loaded_vault, 'A vault file must be loaded');
      this.qr_required = true;
      try {
        this.qr_secrets = await DecipherSecretsQr(qrKey, this.loaded_vault.secrets);
      } catch (err) {
        assert(false, 'Invalid QR code');
      }
    },

    async UnlockVaultPassword(password) {
      let pass_key = await PassKeyFromPassword(password);
      await this.UnlockVaultPasskey(pass_key);
    },

    async UnlockVaultPasskey(passkey) {
      assert(this.loaded_vault, 'A vault file must be loaded');
      let old_pass_key = this.pass_key;
      let old_char_key = this.char_key;
      let old_hashed_char_key = this.hashed_char_key;
      try {
        this.pass_key = passkey;
        this.char_key = await DecipherCharKey(this.pass_key, this.loaded_vault.key);
        this.hashed_char_key = await HashCharKey(this.char_key);
        let secrets = {};
        if (this.qr_required) {
          secrets = await DecipherSecrets(this.hashed_char_key, this.qr_secrets);
        } else {
          secrets = await DecipherSecrets(this.hashed_char_key, this.loaded_vault.secrets);
        }
        this.LoadSecrets(secrets);
      } catch (err) {
        this.pass_key = old_pass_key;
        this.char_key = old_char_key;
        this.hashed_char_key = old_hashed_char_key;
        throw err;
      }
    },

    async UnlockVaultCharKey(char_key) {
      assert(this.loaded_vault, 'A vault file must be loaded');
      try {
        this.char_key = char_key;
        this.hashed_char_key = await HashCharKey(this.char_key);
        let secrets = {};
        if (this.qr_required){
          secrets = await DecipherSecrets(this.hashed_char_key, this.qr_secrets);
        } else {
          secrets = await DecipherSecrets(this.hashed_char_key, this.loaded_vault.secrets);
        }
        this.LoadSecrets(secrets);
        this.loaded_vault = null;
      } catch (err) {
        this.pass_key = null;
        this.char_key = null;
        assert(false, "Invalid code");
      }
    },

    async SaveLocalVault() {
      assert(this.local_vault_path, 'No vault path is set');
      let content = await this.GetSavableVault();
      this.SaveVault(content);
    },

    async SaveVault(vault) {
      fs.writeFileSync(this.local_vault_path, JSON.stringify(vault));
      fs.writeFileSync(this.GetLastUsedVaultPath(), this.local_vault_path);
    },

    async GetSavableVault(){
      assert(this.secrets, 'No vault is open');
      assert(this.pass_key, 'A pass key must exist to save a vault');
      assert(this.char_key, 'A char key must exist to save a vault');
      assert(this.hashed_char_key, 'A hashed character key must exist to save a vault');
      let cipheredCharKey = await CipherCharKey(this.pass_key, this.char_key);
      let encrypted_secrets = await CipherSecrets(this.hashed_char_key, this.secrets);
      if (this.qr_required){
        assert(this.qr_key, 'A QR key must exist to save a vault');
        encrypted_secrets = await CipherSecretsQr(this.qr_key, encrypted_secrets);
      }
      let vault = {
        version: VERSION,
        key: cipheredCharKey,
        secrets: encrypted_secrets,
        qr_required: this.qr_required,
        email: this.email,
        cloud_vault_hash: this.cloud_vault_hash,
      };
      this.encrypted_vault_size = Buffer.byteLength(JSON.stringify(vault));
      return vault;
    },

    async SaveCloudVaultIfEmail(){
      if (this.email){
        if (!isLoggedIn()){
          let cloudKey = await DeriveCloudKey(this.pass_key);
          let body = await authenticate(this.email, cloudKey);
          setToken(body.jwt);
        }
        await upsertVault(await this.GetSavableVault());
        await this.DownloadVault();
      }
    },

    ClearLastUsedVaultCache(){
      let filepath = this.GetLastUsedVaultPath();
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    },

    LoadLastUsedVault(){
      let vault_path = fs.readFileSync(this.GetLastUsedVaultPath(), 'utf-8');
      this.LoadVault(vault_path);
    },

    GetLastUsedVaultPath(){
      return `${app.getPath('userData')}/last_used_vault`;
    },

    async SaveBoth(){
      await this.SaveLocalVault();
      await this.SaveCloudVaultIfEmail();
    },

    async DownloadVault(){
      let vaults = await getVaults();
      if (vaults.length < 1) {
        throw 'No vaults found on server';
      }

      this.loaded_vault = vaults[0].data;
      this.cloud_vault_hash = await HashCloudVault(JSON.stringify(this.loaded_vault));
    },
  },
};
