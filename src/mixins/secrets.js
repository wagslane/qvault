import uuidv4 from 'uuid/v4';
import Vue from 'vue';
import assert from '../lib/assert';

export default {
  data() {
    return {
      secrets: null
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

    SetSecret(boxUUID, secret) {
      let box = this.GetBox(boxUUID);
      let uuid = uuidv4();
      Vue.set(box.secrets, uuid, secret);
      return uuid;
    },

    GetEmptySecret(box_type){
      let secret = {
        created: Date.now(),
        fields: {},
      };
      for (let field of box_type.fields) {
        let value = null;
        if (field.type === Array) {
          value = [];
        }
        Vue.set(secret.fields, field.name, value);
      }
      return secret;
    },

    DeleteSecret(boxUUID, secretUUID){
      let box = this.GetBox(boxUUID);
      Vue.delete(box.secrets, secretUUID);
    },

    DeleteBox(boxUUID){
      this.GetBox(boxUUID);
      Vue.delete(this.secrets, boxUUID);
    },

    LoadSecrets(newSecrets) {
      if (!this.secrets) {
        this.secrets = {};
      }
      for (const boxKey of Object.keys(newSecrets)) {
        // Insert missing boxes
        if (!(boxKey in this.secrets)) {
          Vue.set(this.secrets, boxKey, newSecrets[boxKey]);
          continue;
        }
        for (const secretKey of Object.keys(newSecrets[boxKey].secrets)) {
          const newSecret = newSecrets[boxKey].secrets[secretKey];
          let currentBoxSecrets = this.secrets[boxKey].secrets;
          // Insert missing secrets
          if (!(secretKey in currentBoxSecrets)) {
            Vue.set(currentBoxSecrets, secretKey, newSecret);
            continue;
          }

          for (const fieldKey of Object.keys(newSecret.fields)) {
            const newFieldVal = newSecret.fields[fieldKey];
            let currentSecretFields = currentBoxSecrets[secretKey].fields;

            // Insert missing fields
            if (!(fieldKey in currentSecretFields)) {
              Vue.set(currentSecretFields, fieldKey, newFieldVal);
              continue;
            }

            // handle normal fields
            if (!Array.isArray(newFieldVal)){
              if (newFieldVal !== currentSecretFields[fieldKey]){
                this.$store.commit('pushConflict', {
                  boxKey,
                  secretKey,
                  fieldKey,
                  value: newFieldVal
                });
              }
              continue;
            }

            // handle subfield groups
            for (const i of newFieldVal.keys()) {
              const newSubfieldGroup = newFieldVal[i];
              let currentSubfieldGroupList = currentSecretFields[fieldKey];

              // Insert missing subfield groups
              if (i >= currentSecretFields[fieldKey].length) {
                currentSubfieldGroupList.push(newSubfieldGroup);
                continue;
              }

              for (const newSubFieldKey of Object.keys(newSubfieldGroup)) {
                const newSubField = newSubfieldGroup[newSubFieldKey];
                let currentSubfieldGroup = currentSubfieldGroupList[i];

                // Insert missing subfields
                if (!(newSubFieldKey in currentSubfieldGroup)) {
                  Vue.set(currentSubfieldGroup, newSubFieldKey, newSubField);
                  continue;
                }

                if (newSubField !== currentSubfieldGroup[newSubFieldKey]){
                  this.$store.commit('pushConflict', {
                    boxKey,
                    secretKey,
                    fieldKey,
                    subfieldGroupIndex: i,
                    subfieldKey: newSubFieldKey,
                    value: newSubField
                  });
                }
              }
            }
          }
        }
      }
    },
  }
};
