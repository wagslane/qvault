import uuidv4 from 'uuid/v4';
import Vue from 'vue';
import assert from '../lib/assert';
import boxDefinitions from '../consts/boxDefinitions';
import { timestampToFormatted } from '../lib/formatDate';

export default {
  data() {
    return {
      secrets: null
    };
  },
  computed:{
    boxesMetadata() {
      let sortedBoxes = [];
      if (!this.secrets) {
        return sortedBoxes;
      }
      for (let uuid in this.secrets) {
        if (this.secrets.hasOwnProperty(uuid)) {
          const box = this.secrets[uuid];
          const boxDefinition = this.GetBoxDefinition(uuid);
          sortedBoxes.push({
            uuid,
            updated: timestampToFormatted(box.updated),
            customName: box.name,
            displayName: boxDefinition.displayName,
            icon: boxDefinition.icon,
            type: boxDefinition.key
          });
        }
      }
      return sortedBoxes.sort((a, b) => a.displayName < b.displayName ? -1 : 1);
    },
  },
  methods: {
    InitializeSecrets() {
      this.secrets = {};
    },

    CreateBox(name, type) {
      assert(this.secrets, 'No vault is open');
      assert(!(this.HasBoxName(name)), 'A box with that name already exists');
      let newUUID = uuidv4();
      assert(!(newUUID in this.secrets), 'A box with that uuid already exists');
      let box = {
        name,
        type,
        secrets: {},
      };
      this.UpsertBox(newUUID, box);
      return newUUID;
    },

    GetBoxDefinition(boxUUID){
      assert(boxUUID in this.secrets, `${boxUUID} is not a valid box uuid`);
      return boxDefinitions.find(def => def.key === this.GetBoxType(boxUUID));
    },

    UpsertBox(boxUUID, box){
      const boxCopy = JSON.parse(JSON.stringify(box));
      boxCopy.updated = Date.now();
      Vue.set(this.secrets, boxUUID, boxCopy);
    },

    GetBox(uuid) {
      assert(this.secrets, 'No vault is open');
      assert(uuid in this.secrets, `${uuid} is not a valid box uuid`);
      return this.secrets[uuid];
    },

    GetBoxType(uuid) {
      assert(this.secrets, 'No vault is open');
      assert(uuid in this.secrets, `${uuid} is not a valid box uuid`);
      return this.secrets[uuid].type;
    },

    GetBoxSecretUUIDs(uuid){
      assert(this.secrets, 'No vault is open');
      assert(uuid in this.secrets, `${uuid} is not a valid box uuid`);
      return Object.keys(this.secrets[uuid].secrets);
    },

    DeleteBox(boxUUID) {
      assert(boxUUID in this.secrets, `${boxUUID} is not a valid uuid`);
      Vue.delete(this.secrets, boxUUID);
    },

    HasBoxName(name) {
      return Boolean(
        Object.values(this.secrets).find(
          box => box.name === name
        )
      );
    },

    HasBoxType(type) {
      return Boolean(
        Object.values(this.secrets).find(
          box => box.type === type
        )
      );
    },

    CreateSecret(boxUUID, secret) {
      let newUUID = uuidv4();
      this.UpsertSecret(boxUUID, newUUID, secret);
      return newUUID;
    },

    UpsertSecret(boxUUID, secretUUID, secret){
      const secretCopy = JSON.parse(JSON.stringify(secret));
      secretCopy.updated = Date.now();
      assert(this.secrets, 'No vault is open');
      assert(boxUUID in this.secrets, `${boxUUID} is not a valid uuid`);
      Vue.set(this.secrets[boxUUID].secrets, secretUUID, secretCopy);
      this.UpsertBox(boxUUID, this.secrets[boxUUID]);
    },

    GetEmptySecret(boxDefinition){
      let secret = {
        updated: Date.now(),
        fields: {},
      };
      for (let field of boxDefinition.fields) {
        let value = null;
        if (field.type === Array) {
          value = [];
        }
        Vue.set(secret.fields, field.key, value);
      }
      return secret;
    },

    DeleteSecret(boxUUID, secretUUID){
      assert(this.secrets, 'No vault is open');
      assert(boxUUID in this.secrets, `${boxUUID} is not a valid box uuid`);
      Vue.delete(this.secrets[boxUUID].secrets, secretUUID);
    },

    GetSecretCopy(boxUUID, secretUUID){
      assert(this.secrets, 'No vault is open');
      assert(boxUUID in this.secrets, `${boxUUID} is not a valid box uuid`);
      assert(secretUUID in this.secrets[boxUUID].secrets, `${secretUUID} is not a valid secret uuid`);
      return JSON.parse(JSON.stringify(this.secrets[boxUUID].secrets[secretUUID]));
    },

    GetSecretQuickAccessName(boxUUID, secretUUID){
      assert(boxUUID in this.secrets, `${boxUUID} is not a valid box uuid`);
      const box = this.secrets[boxUUID];
      assert(secretUUID in box.secrets, `${secretUUID} is not a valid secret uuid`);
      const secret = box.secrets[secretUUID];

      const boxDefinition = this.GetBoxDefinition(boxUUID);
      if (secret.fields[boxDefinition.quick_access_name]) {
        return secret.fields[boxDefinition.quick_access_name];
      }
      return "Unnamed Secret";
    },

    GetExistingQuickAccessDefinitions(boxUUID, secretUUID){
      assert(boxUUID in this.secrets, `${boxUUID} is not a valid box uuid`);
      const box = this.secrets[boxUUID];
      assert(secretUUID in box.secrets, `${secretUUID} is not a valid secret uuid`);
      const secret = box.secrets[secretUUID];

      const boxDefinition = this.GetBoxDefinition(boxUUID);
      const existingQuickAccessSecrets = boxDefinition.quick_access_secrets.filter(
        key => secret.fields[key]
      );
      return boxDefinition.fields.filter(
        fieldObj => existingQuickAccessSecrets.includes(fieldObj.key)
      );
    },

    GetFieldValue(boxUUID, secretUUID, fieldDefKey){
      assert(boxUUID in this.secrets, `${boxUUID} is not a valid box uuid`);
      const box = this.secrets[boxUUID];
      assert(secretUUID in box.secrets, `${secretUUID} is not a valid secret uuid`);
      const secret = box.secrets[secretUUID];
      assert(fieldDefKey in secret.fields, `${secretUUID} is not a valid field key`);
      return secret.fields[fieldDefKey];
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
                  updated: newSecret.updated,
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
                    updated: newSecret.updated,
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
