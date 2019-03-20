import uuidv4 from 'uuid/v4';
import Vue from 'vue';
import assert from '../lib/assert.es6';

export default {
  data(){
    return {
      secrets: null,
    };
  },
  methods:{
    InitializeSecrets(){
      this.secrets = {};
    },

    CreateBox(name, fields){
      assert(this.secrets, 'No vault is open');
      let uuid = uuidv4();
      let box = {
        name,
        secrets: {},
        fields,
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

    CreateSecret(box_uuid, name){
      let box = this.GetBox(box_uuid);
      let uuid = uuidv4();
      let values = {};
      for(let field of box.fields){
        Vue.set(values, field, null);
      }
      let secret = {
        name,
        values,
        created: Date.now(),
      };
      Vue.set(box.secrets, uuid, secret);
      return uuid;
    },

    LoadSecrets(new_secrets){
      if (!this.secrets){
        this.secrets = {};
      }
      for (const box_key in new_secrets) {
        if(new_secrets.hasOwnProperty(box_key)){
          // Insert missing boxes
          if (!(box_key in this.secrets)){
            Vue.set(this.secrets, box_key, new_secrets[box_key]);
            continue;
          }
          for (const secret_key in new_secrets[box_key]){
            if(new_secrets[box_key].hasOwnProperty(secret_key)) {
              // Insert missing secrets
              if (!(secret_key in this.secrets[ box_key ])) {
                Vue.set(this.secrets[ box_key ], secret_key, new_secrets[ box_key ][ secret_key ]);
                continue;
              }
              // Ignore identical secrets
              if (JSON.stringify(this.secrets[ box_key ][ secret_key ]) === JSON.stringify(new_secrets[ box_key ][ secret_key ])) {
                continue;
              }
              // Assign conflicts
              Vue.set(this.secrets[ box_key ][ secret_key ], 'conflict', new_secrets[ box_key ][ secret_key ]);
            }
          }
        }
      }
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
};
