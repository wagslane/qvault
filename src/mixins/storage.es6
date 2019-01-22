import fs from 'fs';
import uuidv4 from 'uuid/v4';
import Vue from 'vue';
const { dialog } = require('electron').remote;

import {GetMasterKeyNoQR, decipherString, GetMasterKeyQR} from '../lib/QVaultCrypto/QVaultCrypto';

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

function assert(expression, error_message){
  if(!expression){
    alert(error_message);
    throw new Error(error_message);
  }
}

export default {
  data(){
    return {
      qr_key: null,
      char_key: null,
      pass_key: null,

      secrets: null,
      LOCAL_VAULT_PATH: null,
    };
  },
  asyncComputed:{
    async master_key(){
      if(this.char_key){
        if(this.qr_key){
          return await GetMasterKeyQR(this.char_key, this.qr_key);
        } else {
          return await GetMasterKeyNoQR(this.char_key);
        }
      }
    },
  },
  methods: {
    CheckFileNames(filenames){
      assert(filenames, 'No file selected');
      assert(filenames.length !== 1, 'Please select one file');
    },
    SaveLocalVaultDialog(){
      let filenames = dialog.showSaveDialog({
        filters: FILE_FILTERS,
      });
      this.CheckFileNames(filenames);
      this.LOCAL_VAULT_PATH = filenames[0];
    },
    CreateLocalVault(){
      this.secrets = {};
      fs.writeFile(this.LOCAL_VAULT_PATH, this.GetSavableVault());
    },
    LoadLocalVault() {
      assert(this.master_key, 'A master key must exist to load a vault');

      let filenames = dialog.showOpenDialog({
        filters: FILE_FILTERS
      });

      this.CheckFileNames(filenames);

      try {
        let data = fs.readFileSync(filenames[0], 'utf-8');
        let VAULT_DATA = JSON.parse(data);
        // assert(VAULT_DATA.version, "Selected vault doesn't contain a version"); // Doesn't matter yet
        this.LOCAL_VAULT_PATH = filenames[0];
        this.secrets = decipherString(this.master_key, VAULT_DATA.secrets);
      } catch (err) {
        assert(false, "Couldn't read file");
      }

    },
    GetSavableVault(){
      assert(this.secrets, 'No vault is open');
      assert(this.master_key, 'A master key must exist to save a vault');
      return JSON.stringify({
        "version": "0.0.1",
        "secrets": cipherString(this.master_key, this.secrets),
      });
    },
    SaveLocalVault() {
      assert(this.LOCAL_VAULT_PATH, 'No vault path is set');
      try {
        fs.writeFileSync(this.LOCAL_VAULT_PATH, this.GetSavableVault());
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
