import fs from 'fs';
import { remote } from 'electron';
const dialog = remote.dialog;
const app = remote.app;
const pjson = require('../../package.json');
import { authenticate, isLoggedIn, upsertVault, setToken } from '../lib/CloudClient/CloudClient';
import assert from '../lib/assert.es6';
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
      email: null
    };
  },
  
  methods: {
    ExistingVaultDialog(){
      let paths = dialog.showOpenDialog({
        filters: FILE_FILTERS
      });
      assert(paths.length === 1, "Invalid number of paths selected");
      assert(paths[0], 'A vault file must be selected');
      this.LoadVault(paths[0]);
    },

    LoadVault(vault_path){
      this.local_vault_path = vault_path;
      try {
        let data = fs.readFileSync(this.local_vault_path, 'utf-8');
        this.loaded_vault = JSON.parse(data);
        assert(this.loaded_vault.version, 'Selected vault is corrupted');
        this.email = this.loaded_vault.email;
        this.qr_required = this.loaded_vault.qr_required;
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
      return await this.SaveLocalVault();
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
      assert(this.loaded_vault, 'A vault file must be loaded');
      try {
        this.pass_key = await PassKeyFromPassword(password);
        this.char_key = await DecipherCharKey(this.pass_key, this.loaded_vault.key);
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
        throw new Error(err);
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
      try {
        let content = await this.GetSavableVault();
        this.SaveVault(content);
      } catch (err) {
        return err;
      }
    },

    async SaveVault(vault) {
      fs.writeFileSync(this.local_vault_path, JSON.stringify(vault));
      fs.writeFileSync(this.GetLastUsedVaultPath(), this.local_vault_path);
      alert('Vault saved successfully!');
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
      return {
        version: VERSION,
        key: cipheredCharKey,
        secrets: encrypted_secrets,
        qr_required: this.qr_required,
        email: this.email
      };
    },

    async SaveCloudVaultIfEmail(){
      if (this.email){
        if (!isLoggedIn()){
          let cloudKey = await DeriveCloudKey(this.pass_key);
          let body = await authenticate(this.email, cloudKey);
          setToken(body.jwt);
        }
        let vault = await this.GetSavableVault();
        await upsertVault(vault);
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
    }
  },
};
