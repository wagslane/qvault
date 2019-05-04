import uuidv4 from 'uuid/v4';
import Vue from 'vue';
import assert from '../lib/assert.es6';
import box_types from '../consts/box_types.es6';

export default {
  data() {
    return {
      secrets: null,
    };
  },
  methods: {
    InitializeSecrets() {
      this.secrets = {};
    },

    CreateBox(name, type) {
      assert(this.secrets, 'No vault is open');
      assert(!(this.HasBox(name)), 'A box with that name already exists');
      let uuid = uuidv4();
      assert(!(uuid in this.secrets), 'A box with that uuid already exists');
      let box = {
        name,
        type,
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

    HasBox(name) {
      return Boolean(
        Object.values(this.secrets).find(
          box => box.name == name
        )
      );
    },

    CreateSecret(box_uuid) {
      let box = this.GetBox(box_uuid);
      let uuid = uuidv4();
      let secret = {
        created: Date.now(),
      };
      let box_type = box_types.find(box_type => box_type.name === box.type);
      for (let field of box_type.fields) {
        let value = null;
        if (field.type === Array) {
          value = [];
        }
        Vue.set(secret, field.name, value);
      }
      Vue.set(box.secrets, uuid, secret);
      return uuid;
    },

    DeleteSecret(box_uuid, secret_uuid){
      let box = this.GetBox(box_uuid);
      Vue.delete(box.secrets, secret_uuid);
    },

    DeleteBox(box_uuid){
      this.GetBox(box_uuid);
      Vue.delete(this.secrets, box_uuid);
    },

    LoadSecrets(new_secrets) {
      if (!this.secrets) {
        this.secrets = {};
      }
      for (const box_key of Object.keys(new_secrets)) {
        if (!(box_key in this.secrets)) {
          // Insert missing boxes
          Vue.set(this.secrets, box_key, new_secrets[box_key]);
          continue;
        }
        for (const secret_key of Object.keys(new_secrets[box_key].secrets)) {
          const new_secret = new_secrets[box_key].secrets[secret_key];
          let current_box_secrets = this.secrets[box_key].secrets;

          if (!(secret_key in current_box_secrets)) {
            // Insert missing secrets
            Vue.set(current_box_secrets, secret_key, new_secret);
          }
          else if (JSON.stringify(current_box_secrets[secret_key]) === JSON.stringify(new_secret)) {
            // Ignore identical secrets
          }
          else {
            // Assign conflicts
            Vue.set(current_box_secrets[secret_key], 'conflict', new_secret);
          }
        }
      }
    },

    BoxHasConflict(box_uuid){
      let box = this.GetBox(box_uuid);
      for(let secret_uuid of Object.keys(box.secrets)){
        let secret = box.secrets[secret_uuid];
        if(secret.conflict){
          return true;
        }
      }
      return false;
    },
  },
  computed: {
    ConflictExists(){
      if(this.secrets){
        for(const box_key of Object.keys(this.secrets)){
          const box = this.secrets[box_key];
          for (const secret_key of Object.keys(box.secrets)){
            const secret = box.secrets[secret_key];
            if(secret.conflict){
              return true;
            }
          }
        }
        return false;
      }
    },
  }
};
