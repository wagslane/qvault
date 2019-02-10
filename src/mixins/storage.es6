import fs from 'fs';
import uuidv4 from 'uuid/v4';
import Vue from 'vue';
const { dialog } = require('electron').remote;
const pjson = require('../../package.json');

import assert from '../lib/assert.es6';
import {
  GenerateCharKey,
  PassKeyFromPassword,
  GetMasterKeyNoQR,
  GetMasterKeyQR,
  CipherSecrets,
  DecipherSecrets,
  CipherCharKey,
  DecipherCharKey,
} from '../lib/QVaultCrypto/QVaultCrypto';

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
  data(){
    return {
      char_key: null,
      qr_key: null,
      pass_key: null,
      qr_required: false,
      loaded_vault: null,

      secrets: null,
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
      this.char_key = null;
      this.char_key = await GenerateCharKey();
      return this.char_key;
    },

    CreateQrKey(qrKey){
      this.qr_required = true;
      this.qr_key = qrKey;
    },

    async CreateLocalVault(){
      this.secrets = {};
      return await this.SaveLocalVault();
    },

    async UnlockVault(password, qrKey) {
      assert(this.loaded_vault, 'A vault file must be loaded');
      try {
        this.pass_key = await PassKeyFromPassword(password);
        this.char_key = await DecipherCharKey(this.pass_key, this.loaded_vault.key);
        let master_key = '';
        if (this.loaded_vault.qr_required){
          this.qr_required = true;
          master_key = await GetMasterKeyQR(this.char_key, qrKey);
        } else {
          master_key = await GetMasterKeyNoQR(this.char_key);
        }
        this.secrets = await DecipherSecrets(master_key, this.loaded_vault.secrets);
        this.loaded_vault = null;
      } catch (err) {
        this.pass_key = null;
        this.char_key = null;
        console.log(err);
        assert(false, 'Invalid keys');
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
      assert(this.char_key, 'A character key must exist to save a vault');
      let key = await CipherCharKey(this.pass_key, this.char_key);
      let master_key = '';
      if (this.qr_required){
        assert(this.qr_key, 'A QR key must exist to save a vault');
        master_key = await GetMasterKeyQR(this.char_key, this.qr_key);
      } else {
        master_key = await GetMasterKeyNoQR(this.char_key);
      }
      let encrypted_secrets = await CipherSecrets(master_key, this.secrets);
      return JSON.stringify({
        version: VERSION,
        key: key,
        secrets: encrypted_secrets,
        qr_required: this.qr_required,
      });
    },

    CreateSecret(secret){
      assert(this.secrets, 'No vault is open');
      let uuid = uuidv4();
      Vue.set(this.secrets, uuid, secret);
      return uuid;
    },

    GetSecret(uuid) {
      assert(this.secrets, 'No vault is open');
      assert(uuid in this.secrets, `${uuid} is not a valid uuid`);
      return this.secrets[uuid];
    },

    SetSecret(uuid, secret) {
      assert(this.secrets, 'No vault is open');
      Vue.set(this.secrets, uuid, secret);
    },

    DeleteSecret(uuid) {
      assert(this.secrets, 'No vault is open');
      Vue.delete(this.secrets, uuid);
    },
  },
};
