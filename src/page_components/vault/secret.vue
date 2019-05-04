<template>
  <form @submit.prevent="apply">
    <div class="header">
      <input
        v-model="secret[box_type.header_field]"
        placeholder="Name"
        class="secret_title"
        readonly
      >
      <button
        class="back"
        type="button"
        @click="$router.push({name: 'box', params: {box_uuid: box_uuid}})"
      >
        Back
      </button>
      <button
        v-if="secret.conflict"
        type="button"
        class="apply"
        @click="resolve_conflicts"
      >
        Fix Conflicts
      </button>
      <button
        v-else
        class="apply"
        type="submit"
      >
        Apply
      </button>
    </div>
    <hr>
    <h2
      v-if="secret.conflict"
    > 
      There are conflicts between your local and cloud vaults.
      Make changes if you want to keep anything from the cloud (red) versions, then click "Fix Changes"
    </h2>
    <hr v-if="secret.conflict">
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
        <TextInput
          v-if="field.type === String"
          v-model="secret[field.name]"
          class="secret_value"
          :type="field.hidden ? 'password' : 'text'"
          :keyboard-id="field.name.replace(/[\W_]+/g,'')"
          border-radius="6px"
          :is-missing="apply_clicked && missing_fields.includes(field.name)"
        />
        <span
          v-if="field.type === String
            && secret.conflict
            && secret.conflict[field.name]
            && secret.conflict[field.name] != secret[field.name]"
          :type="field.hidden ? 'password' : 'text'"
          class="conflict"
          readonly
        >
          {{ secret.conflict[field.name] }}
        </span>
        <TextInput
          v-if="field.type === 'textarea'"
          v-model="secret[field.name]"
          type="textarea"
          :keyboard-id="field.name"
          class="secret_value"
          :is-missing="apply_clicked && missing_fields.includes(field.name)"
          border-radius="6px"
        />
        <button
          v-if="field.type === Array"
          type="button"
          class="add_to_sublist"
          @click="add_to_sublist(field)"
        >
          <PlusSolid />
        </button>
        <div
          v-if="field.type === Array"
          class="array-secret"
        >
          <div
            v-for="(subvalue, k) in secret[field.name]"
            :key="k"
            class="subfields"
          >
            <div
              v-for="subfield in field.subfields"
              :key="subfield.name"
              class="subfield"
            >
              <TextInput
                v-if="subfield.type === String"
                v-model="subvalue[subfield.name]"
                :is-missing="apply_clicked && missing_fields.includes(field.name + j + subfield.name)"
                :type="subfield.hidden ? 'password' : 'text'"
                :keyboard-id="(field.name + j + subfield.name).replace(/[\W_]+/g,'')"
                border-radius="6px"
                :placeholder="subfield.name"
              />
              <span
                v-if="subfield.type === String
                  && secret.conflict
                  && secret.conflict[field.name]
                  && secret.conflict[field.name][k]
                  && secret.conflict[field.name][k][subfield.name]
                  && secret.conflict[field.name][k][subfield.name] != subvalue[subfield.name]"
                :type="subfield.hidden ? 'password' : 'text'"
                :title="subfield.name"
                class="conflict"
                readonly
              > 
                {{ secret.conflict[field.name][k][subfield.name] }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import TextInput from "../../components/text_input.vue";
import Vue from 'vue';
import box_types from '../../consts/box_types.es6';
import PlusSolid from '../../img/plus-solid.svg.vue';

export default {
  components: {
    PlusSolid,
    TextInput
  },
  data(){
    return{
      secret: {},
      apply_clicked: false
    };
  },
  computed: {
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
    secret_uuid(){ return this.$route.params.secret_uuid; },
    box(){ return this.$parent.box; },
    box_uuid() { return this.$parent.box_uuid;},
    box_type(){
      return box_types.find(box_type => box_type.name === this.box.type);
    },
    fields(){
      if(this.box_type){
        return this.box_type.fields;
      }
      return {};
    },
    missing_fields(){
      let missing_fields = [];
      for (const field of Object.values(this.fields)){
        if (field.required && !this.secret[field.name]){
          missing_fields.push(field.name);
        }
        if (!('subfields' in field)){
          continue;
        }
        if (!(field.name in this.secret)){
          continue;
        }
        for (const subfield of Object.values(field.subfields)){
          Object.entries(this.secret[field.name]).forEach(entry => {
            if (subfield.required && !entry[1][subfield.name] ){
              missing_fields.push(field.name + entry[0] + subfield.name);
            }
          });
        }
      }
      return missing_fields;
    }
  },
  mounted(){
    this.secret = JSON.parse(JSON.stringify(this.box.secrets[this.secret_uuid]));
  },
  methods: {
    async apply(){
      this.apply_clicked = true;
      if (this.missing_fields.length > 0){
        setTimeout(() => this.apply_clicked = false, 2000);
        return;
      }
      this.box.secrets[this.secret_uuid] = JSON.parse(JSON.stringify(this.secret));
      this.$router.push({name: 'box', params: {box_uuid: this.box_uuid}});
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
      this.secret[field.name].push(new_value);
    },
    resolve_conflicts(){
      Vue.delete(this.secret, 'conflict');
    },
  },
};
</script>

<style lang="less" scoped>
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

      .conflict {
        color: @red-pink;
        font-size: 14px;
        font-weight: 300;
        margin-top: 15px;
        display: block;
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
        }
      }
    }
  }

</style>
