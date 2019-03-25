import uuidv4 from 'uuid/v4';
import Vue from 'vue';
import assert from '../lib/assert.es6';
import box_types from '../consts/box_types.es6';

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

    CreateBox(name, type, fields){
      assert(this.secrets, 'No vault is open');
      let uuid = uuidv4();
      let box = {
        name,
        type,
        secrets: {},
        created: Date.now(),
      };
      if(fields){
        Vue.set(box, 'fields', fields);
      }
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
        created: Date.now(),
      };
      let box_type = box_types.find(box_type => box_type.name === box.name);
      for(let field of box_type.fields){
        let value = null;
        if(field.type === Array){
          value = [];
        }
        Vue.set(secret, field.name, value);
      }
      Vue.set(box.secrets, uuid, secret);
      return uuid;
    },

    LoadSecrets(new_secrets){
      console.log('LoadSecrets');

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
