import fs from 'fs';
const { dialog } = require('electron').remote;
const pjson = require('../../package.json');

import assert from '../lib/assert.es6';
import {
  GenerateCharKey,
  PassKeyFromPassword,
  CipherSecrets,
  DecipherSecrets,
  CipherCharKey,
  DecipherCharKey,
  HashCharKey,
  CipherSecretsQr,
  DecipherSecretsQr,
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
    };
  },
  
  methods: {
    ExistingVaultDialog(){
      let paths = dialog.showOpenDialog({
        filters: FILE_FILTERS
      });
      assert(paths.length === 1, "Invalid number of paths selected");
      this.local_vault_path = paths[0];
      assert(this.local_vault_path, 'A vault file must be selected');
      try {
        let data = fs.readFileSync(this.local_vault_path, 'utf-8');
        this.loaded_vault = JSON.parse(data);
        assert(this.loaded_vault.version, 'Selected vault is corrupted');
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

    async CreateCharKey(){
      this.char_key = await GenerateCharKey();
      this.hashed_char_key = await HashCharKey(this.char_key);
      return this.char_key;
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
        this.secrets = await DecipherSecretsQr(qrKey, this.loaded_vault.secrets);
      } catch (err) {
        assert(false, 'Invalid QR code');
      }
    },

    async UnlockVaultPassword(password) {
      assert(this.loaded_vault, 'A vault file must be loaded');
      try {
        this.pass_key = await PassKeyFromPassword(password);
        let char_key = await DecipherCharKey(this.pass_key, this.loaded_vault.key);
        this.hashed_char_key = await HashCharKey(char_key);
        if (!this.qr_required){
          this.secrets = this.loaded_vault.secrets;
        }
        this.secrets = await DecipherSecrets(this.hashed_char_key, this.secrets);
        this.loaded_vault = null;
      } catch (err) {
        this.pass_key = null;
        this.char_key = null;
        assert(false, "Invalid password");
      }
    },

    async SaveLocalVault() {
      assert(this.local_vault_path, 'No vault path is set');
      try {
        let content = await this.GetSavableVault();
        fs.writeFileSync(this.local_vault_path, content);
      } catch (err) {
        return err;
      }
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
      return JSON.stringify({
        version: VERSION,
        key: cipheredCharKey,
        secrets: encrypted_secrets,
        qr_required: this.qr_required,
      });
    },
  },
};
