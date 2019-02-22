import uuidv4 from 'uuid/v4';
import Vue from 'vue';


import assert from '../lib/assert.es6';

export default {
  data(){
    return {
      secrets: null,
    }
  },
  methods:{
    InitializeSecrets(){
      this.secrets = {};
    },

    CreateBox(){
      assert(this.secrets, 'No vault is open');
      let uuid = uuidv4();
      let box = {
        name: 'Name',
        secrets: {},
        created: Date.now(),
      };
      Vue.set(this.secrets, uuid, box);
      return uuid;
    },

    GetBox(uuid) {
      assert(this.secrets, 'No vault is open');
      assert(uuid in this.secrets, `${uuid} is not a valid uuid`);
      return this.secrets[uuid];
    },

    CreateSecret(box_uuid){
      let box = this.GetBox(box_uuid);
      let uuid = uuidv4();
      let secret = {
        name: null,
        value: null,
        created: Date.now(),
      };
      Vue.set(box.secrets, uuid, secret);
      return uuid;
    }

    // SetSecret(uuid, secret) {
    //   assert(this.secrets, 'No vault is open');
    //   Vue.set(this.secrets, uuid, secret);
    // },

    // DeleteSecret(uuid) {
    //   assert(this.secrets, 'No vault is open');
    //   Vue.delete(this.secrets, uuid);
    // },
  },
}
