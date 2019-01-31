import fs from 'fs';
import uuidv4 from 'uuid/v4';
import Vue from 'vue';
const { dialog } = require('electron').remote;

import assert from '../lib/assert.es6';
import {
  GenerateCharKey,
  PassKeyFromPassword,
  GetMasterKeyNoQR,
  CipherSecrets,
  DecipherSecrets,
  CipherCharKey,
  DecipherCharKey,
} from '../lib/QVaultCrypto/QVaultCrypto';

const QVAULT_FILE_EXTENSION = 'qvault';
const VERSION = "0.0.1";
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
      qr_key: null,
      char_key: null,
      pass_key: null,

      secrets: null,
      local_vault_path: null,
    };
  },
  methods: {
    async GenerateCharKey(){
      this.$root.char_key = null;
      this.$root.char_key = await GenerateCharKey();
    },
    SaveLocalVaultDialog(){
      this.local_vault_path = dialog.showSaveDialog({
        filters: FILE_FILTERS,
      });
    },
    async CreateLocalVault(){
      this.secrets = {};
      return await this.SaveLocalVault();
    },
    OpenLocalVault(){
      let filenames = dialog.showOpenDialog({
        filters: FILE_FILTERS
      });

      assert(filenames, 'No file selected');
      assert(filenames.length === 1, 'Please select only one file');

      this.local_vault_path = filenames[0];
    },
    async LoadLocalVault(password) {
      this.pass_key = await PassKeyFromPassword(password);
      assert(this.local_vault_path, 'A vault file must be selected');

      try {
        let data = fs.readFileSync(this.local_vault_path, 'utf-8');
        let VAULT_DATA = JSON.parse(data);
        this.char_key = await DecipherCharKey(this.pass_key, VAULT_DATA.key);
        let master_key = await GetMasterKeyNoQR(this.char_key);
        // assert(VAULT_DATA.version, "Selected vault doesn't contain a version"); // Doesn't matter yet
        this.secrets = await DecipherSecrets(master_key, VAULT_DATA.secrets);
      } catch (err) {
        assert(false, err);
      }
    },
    async GetSavableVault(){
      assert(this.secrets, 'No vault is open');
      assert(this.pass_key, 'A pass key must exist to save a vault');
      assert(this.char_key, 'A character key must exist to save a vault');
      let master_key = await GetMasterKeyNoQR(this.char_key);
      let key = await CipherCharKey(this.pass_key, this.char_key);
      let encrypted_secrets = await CipherSecrets(master_key, this.secrets);
      return JSON.stringify({
        "version": VERSION,
        "key": key,
        "secrets": encrypted_secrets,
      });
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
