import fs from 'fs';
import { remote } from 'electron';
const dialog = remote.dialog;
const pjson = require('../../package.json');
import { authenticate, isLoggedIn, setToken, getVaults, upsertVault, updateUserPassword } from '../lib/CloudClient/CloudClient';
import assert from '../lib/assert.js';
import parse from 'csv-parse/lib/sync';
import { GetLastUsedVault, SetLastUsedVault } from '../lib/LastUsedVaultPath';
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
  DeriveOldCloudKey,
  HashCloudVault,
  GenerateRandomSalt,
} from '../lib/QVaultCrypto/QVaultCrypto';

import secrets from './secrets.js';

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
      char_key: null,
      qr_key: null,
      qr_required: false,
      loaded_vault: null,
      local_vault_path: null,
      qr_secrets: null,
      email: null,
      encrypted_vault_size: 0,
      password: null,
      cloud_vault_hash: null,
    };
  },

  methods: {
    ResetStorageState(){
      this.char_key = null;
      this.qr_key = null;
      this.password = null;
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
      this.LoadVaultLocal(paths[0]);
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
        throw 'Invalid QR code';
      }
    },

    async UnlockVaultPassword(password, salt) {
      let passKey = await PassKeyFromPassword(password, salt);
      assert(this.loaded_vault, 'A vault file must be loaded');
      let charKey = await DecipherCharKey(passKey, this.loaded_vault.key);
      await this.UnlockVaultCharKey(charKey);
      this.password = password;
    },

    async UnlockVaultCharKey(charKey) {
      assert(this.loaded_vault, 'A vault file must be loaded');
      try {
        let hashedCharKey = await HashCharKey(charKey);
        let secrets = {};
        if (this.qr_required){
          secrets = await DecipherSecrets(hashedCharKey, this.qr_secrets);
        } else {
          secrets = await DecipherSecrets(hashedCharKey, this.loaded_vault.secrets);
        }
        this.LoadSecrets(secrets);
        this.char_key = charKey;
      } catch (err) {
        throw "Invalid code";
      }
    },

    async SaveLocalVault() {
      assert(this.local_vault_path, 'No vault path is set');
      let content = await this.GetSavableVault();
      this.SaveVault(content);
    },

    async SaveVault(vault) {
      fs.writeFileSync(this.local_vault_path, JSON.stringify(vault));
      SetLastUsedVault(this.local_vault_path);
    },

    async GetSavableVault(){
      assert(this.secrets, 'No vault is open');
      assert(this.password, 'A password must exist to save your vault');
      assert(this.char_key, 'A char key must exist to save your vault');
      const newSalt = GenerateRandomSalt();
      const passKey = await PassKeyFromPassword(this.password, newSalt);
      const cipheredCharKey = await CipherCharKey(passKey, this.char_key);
      const hashedCharKey = await HashCharKey(this.char_key);
      let encryptedSecrets = await CipherSecrets(hashedCharKey, this.secrets);
      if (this.qr_required){
        assert(this.qr_key, 'A QR key must exist to save your vault');
        encryptedSecrets = await CipherSecretsQr(this.qr_key, encryptedSecrets);
      }
      let vault = {
        salt: newSalt,
        version: VERSION,
        key: cipheredCharKey,
        secrets: encryptedSecrets,
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
          await this.Login(this.email, this.password);
        }
        await upsertVault(await this.GetSavableVault());
        await this.DownloadVault();
      }
    },

    LoadLastUsedVault(){
      this.LoadVaultLocal(GetLastUsedVault());
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

      this.LoadVaultDetails(vaults[0].data);
      this.cloud_vault_hash = await HashCloudVault(this.loaded_vault);
    },

    LoadVaultLocal(vault_path) {
      this.local_vault_path = vault_path;
      try {
        let data = fs.readFileSync(this.local_vault_path, 'utf-8');
        this.LoadVaultDetails(JSON.parse(data));
      } catch (err) {
        this.loaded_vault = null;
        this.local_vault_path = null;
        throw err;
      }
    },

    LoadVaultDetails(vault_data) {
      // TODO: merge this with conflict resolution
      this.loaded_vault = vault_data;
      assert(this.loaded_vault.version, 'Selected vault is corrupted');
      this.email = this.loaded_vault.email;
      this.qr_required = this.loaded_vault.qr_required;
      this.encrypted_vault_size = Buffer.byteLength(JSON.stringify(this.loaded_vault));
    },

    async Login(email, password) {
      let body = {};
      try {
        let cloudKey = await DeriveCloudKey(password);
        body = await authenticate(email, cloudKey);
        setToken(body.jwt);
      } catch (err) {
        let oldKey = await DeriveOldCloudKey(password);
        body = await authenticate(email, oldKey);
        setToken(body.jwt);

        let newKey = await DeriveCloudKey(password);
        updateUserPassword(oldKey, newKey);
      }
      this.email = email;
      this.password = password;
    }
  },
};
