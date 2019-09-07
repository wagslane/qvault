<template>
  <form
    v-if="secret"
    @submit.prevent="apply"
  >
    <div class="header">
      <input
        v-model="secret.fields[box_type.header_field]"
        placeholder="Name"
        class="secret_title"
        readonly
      >
      <button
        class="back"
        type="button"
        @click="$router.push({name: 'Box', params: {boxUUID: boxUUID}})"
      >
        Back
      </button>
      <button
        class="apply"
        type="submit"
      >
        Apply
      </button>
    </div>
    <hr>
    <div
      v-for="(row, i) in rows"
      :key="i"
      class="row"
    >
      <div
        v-for="(field, j) in row"
        :key="j"
        class="secret"
      >
        <label
          class="secret_name"
          :style="{display: field.type === Array ? 'inline-block' : 'block'}"
        >{{ field.name }}</label>
        <button
          v-if="field.type === Array"
          type="button"
          class="add_to_sublist"
          @click="add_to_sublist(field)"
        >
          <PlusSolid />
        </button>
        <TextInputReadonly
          v-if="field.readonly"
          :content="field.generated ? generatedContent[getFieldID(field.name)] : secret.fields[field.name]"
          :type="field.hidden ? 'password' : 'text'"
          :qr-button="field.qrButton"
          border-radius="6px"
        />
        <TextInput
          v-else-if="field.type === String"
          v-model="secret.fields[field.name]"
          class="secret_value"
          :type="field.hidden ? 'password' : 'text'"
          :keyboard-id="getFieldID(field.name)"
          border-radius="6px"
          :is-missing="apply_clicked && missingFields.includes(getFieldID(field.name))"
          :generate-password="field.name === 'Password'"
        />
        <TextInput
          v-else-if="field.type === 'textarea'"
          v-model="secret.fields[field.name]"
          type="textarea"
          :keyboard-id="getFieldID(field.name)"
          class="secret_value"
          :is-missing="apply_clicked && missingFields.includes(getFieldID(field.name))"
          border-radius="6px"
        />
        <div
          v-else-if="field.type === Array"
          class="array-secret"
        >
          <div
            v-for="(subvalue, k) in secret.fields[field.name]"
            :key="k"
            class="subfields"
          >
            <div
              v-for="subfield in field.subfields"
              :key="subfield.name"
              class="subfield"
            >
              <TextInputReadonly
                v-if="subfield.readonly"
                :content="subfield.generated ? generatedContent[getFieldID(field.name, j, subfield.name)] : subvalue[subfield.name]"
                :type="subfield.hidden ? 'password' : 'text'"
                :qr-button="subfield.qrButton"
                border-radius="6px"
              />
              <TextInput
                v-else-if="subfield.type === String"
                v-model="subvalue[subfield.name]"
                :type="subfield.hidden ? 'password' : 'text'"
                :keyboard-id="getFieldID(field.name, j, subfield.name)"
                border-radius="6px"
                :placeholder="subfield.name"
                :generate-password="subfield.name === 'Password'"
              />
            </div>
            <div
              class="trash"
              @click="showDeleteSubfieldModal(field.name, k)"
              v-html="TrashSVG"
            />
          </div>
        </div>
      </div>
    </div>
    <confirm
      ref="deleteSubFieldModal"
      title="Are you sure you want to delete this field?"
    />
  </form>
</template>

<script>
import TextInput from "../../components/TextInput.vue";
import TextInputReadonly from "../../components/TextInputReadonly.vue";
import Vue from 'vue';
import box_types from '../../consts/box_types';
import PlusSolid from '../../img/plus-solid.svg.vue';
import TrashSVG from '../../img/trash.svg';
import confirm from '../../components/Confirm.vue';

export default {
  components: {
    PlusSolid,
    TextInput,
    TextInputReadonly,
    confirm
  },
  data(){
    return{
      secret: null,
      apply_clicked: false,
      // re-generating all data on each input change
      // is computationally expensive, so we do it async
      generatedContent: {}
    };
  },
  computed: {
    TrashSVG(){
      return TrashSVG;
    },
    rows(){
      let rows = [];
      for (let i = 0; i < this.fields.length; i++){
        if (this.fields[i].type === Array){
          rows.push([ this.fields[i] ]);
        }else if (i + 1 < this.fields.length){
          rows.push([ this.fields[i], this.fields[i+1] ]);
          i++;
        } else{
          rows.push([ this.fields[i] ]);
        }
      }
      return rows;
    },
    secretUUID(){ 
      if ('secretUUID' in this.$route.params){
        return this.$route.params.secretUUID;
      } 
      return null;
    },
    box(){ return this.$parent.box; },
    boxUUID() { return this.$parent.boxUUID;},
    box_type(){
      return box_types.find(box_type => box_type.key === this.box.type);
    },
    fields(){
      if(this.box_type){
        return this.box_type.fields;
      }
      return {};
    },
    missingFields(){
      let missingFields = [];
      if(this.secret){
        for (const field of Object.values(this.fields)){
          if (field.required && !this.secret.fields[field.name]){
            missingFields.push(this.getFieldID(field.name));
          }
        }
      }
      return missingFields;
    }
  },
  mounted(){
    if(this.secretUUID === null){
      this.secret = this.$root.GetEmptySecret(this.box_type);
    } else{
      this.secret = this.$root.GetSecretCopy(this.boxUUID, this.secretUUID);
    }
    for(const row of this.rows){
      for(const field of row){
        if(field.type === Array){
          for(const k of Object.keys(this.secret.fields[field.name])){
            for(const subfield of field.subfields){
              this.setGeneratedContent(this.getFieldID(field.name, k, subfield.name), field);
            }
          }
        } else {
          this.setGeneratedContent(this.getFieldID(field.name), field);
        }
      }
    }
  },
  methods: {
    getFieldID(fieldName, subfieldIndex, subfieldName){
      return `${fieldName}${subfieldIndex}${subfieldName}`.replace(/[\W_1-9]+/g,'');
    },
    async setGeneratedContent(id, field){
      if (!field.generated){
        return null;
      }
      let params = [];
      for (const paramObj of field.generated.params){
        if (paramObj.hasOwnProperty('value')){
          params.push(paramObj.value);
        }
        if (paramObj.hasOwnProperty('key')){
          params.push(this.secret.fields[paramObj.key]);
        }
      }
      Vue.set(this.generatedContent, id, await field.generated.func(...params));
    },
    showDeleteSubfieldModal(name, index){
      this.$refs.deleteSubFieldModal.show(() => {return this.removeFromSublist(name, index);});
    },
    async apply(){
      this.apply_clicked = true;
      if (this.missingFields.length > 0){
        setTimeout(() => this.apply_clicked = false, 2000);
        return;
      }
      if (this.secretUUID === null){
        this.$root.CreateSecret(this.boxUUID, this.secret);
      } else{
        this.$root.UpsertSecret(this.boxUUID, this.secretUUID, this.secret);
      }
      this.$router.push({name: 'Box', params: {boxUUID: this.boxUUID}});
    },
    add_to_sublist(field){
      let new_value = {};
      for(let subfield of field.subfields){
        let value = null;
        if(subfield.type === Array){
          value = [];
        }
        Vue.set(new_value, subfield.name, value);
      }
      this.secret.fields[field.name].push(new_value);
    },
    removeFromSublist(fieldname, i){
      Vue.delete(this.secret.fields[fieldname], i);
    },
  },
};
</script>

<style lang="less">
  @import '../../styles/colors.less';

  form {
    margin-left: -10px;
  }

  hr {
    box-sizing: border-box;
    height: 2px;
    border: 1px solid @black-lighter;
    margin: 10px;
  }

  h2{
    color: @red-pink;
    margin-top: 5px;
    margin-bottom: 5px;
  }

  .header{
    display: flex;
    flex-direction: row;
    margin-top: 10px;

    .secret_title {
      flex-grow: 1;
      flex-basis: 0;
      font-size: 22px;
      border: none;
      border-radius: 6px;
      background: transparent;
      color: @gray-light;
      width: ~'calc(100% - 150px)';
      padding: 10px;
    }

    button{
      font-size: 18px;
      margin: 12px;
      background: transparent;
      border-radius: 6px;
      cursor: pointer;
      text-decoration: none;
      height: 50px;
      width: 100px;

      &:hover {
        background-color: @gold-mid;
        border: 1px solid @gold-mid;
        color: white;
        text-decoration: none;
      }

      &:focus {
        outline:0;
      }
    }

    .apply {
      &:extend(button);
      color: @gold-mid;
      border: 1px solid @gold-mid;
    }

    .back {
      &:extend(button);
      color: @gray-light;
      border: 1px solid @gray-blue;
    }
  }

  .row{
    margin-bottom: 10px;
    display: flex;
    flex-direction: row;

    .secret {
      flex-grow: 1;
      flex-basis: 200px;
      margin: 10px;

      .secret_name {
        font-size: 12px;
        padding-bottom: 12px;
        border: none;
        background: transparent;
        color: @gray-mid;
      }

      .secret_value {
        background: transparent;
        width: 100%;

        &:focus {
          border: 1px solid @gold-mid;
          outline: none;
        }
      }

      .add_to_sublist {
        border: none;
        background: transparent;
        cursor: pointer;
        outline: none;
        margin-bottom: 5px;
        float: left;
      }

      .array-secret {
        flex-grow: 1;
        flex-basis: 800px;

        .subfields {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;

          .subfield {
            flex-grow: 1;
            flex-basis: 200px;
            margin: 10px;
          }

          .trash {
            cursor: pointer;
            display: inline-block;
            margin-top: 20px;

            svg {
              path {
                stroke: @gray-darker;
              }
              line {
                stroke: @gray-darker;
              }
            }

            &:hover{
              svg {
                path {
                  stroke: @red-pink;
                }
                line {
                  stroke: @red-pink;
                }
              }
            }
          }
        }
      }
    }
  }

</style>
