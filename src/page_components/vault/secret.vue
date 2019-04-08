<template>
  <form
    v-if="secret"
  >
    <input
      v-model="secret[box_type.header_field]"
      placeholder="Name"
      class="box_name"
      readonly
    >
    <hr>
    <div
      v-for="field in fields"
      :key="field.name"
      class="secret"
    >
      <label class="secret_name">{{ field.name }}</label>
      <input
        v-if="field.type === String"
        v-model="secret[field.name]"
        placeholder="value"
        class="secret_value"
      >
      <input
        v-if="field.type === String
        && secret.conflict
        && secret.conflict[field.name]
        && secret.conflict[field.name] != secret[field.name]"
        v-model="secret.conflict[field.name]"
        class="secret_value conflict"
        readonly
      >
      <div
        v-if="field.type === Array"
        class="array-secret"
      >
        <button
          @click.prevent="add_to_sublist(field)"
          class="add_to_sublist"
        >
          <img src="../../img/plus-solid.svg"/>
        </button>
        <div
          v-for="(subvalue, j) in secret[field.name]"
          :key="j"
          class="subfields"
        >
          <div
            v-for="subfield in field.subfields"
            :key="subfield.name"
            class="subfield"
          >
            <input
              v-if="subfield.type === String"
              v-model="subvalue[subfield.name]"
              :placeholder="subfield.name"
              class="secret_value"
            >
            <input
              v-if="subfield.type === String
              && secret.conflict
              && secret.conflict[field.name]
              && secret.conflict[field.name][j]
              && secret.conflict[field.name][j][subfield.name]
              && secret.conflict[field.name][j][subfield.name] != subvalue[subfield.name]"
              v-model="secret.conflict[field.name][j][subfield.name]"
              :title="subfield.name"
              class="secret_value conflict"
              readonly
            >
          </div>
        </div>
      </div>
      <!--<button v-clipboard:copy="secret[field]">copy</button>-->
    </div>
    <button
      class="btn btn-warning"
      v-if="secret.conflict"
      @click.prevent="resolve_conflicts"
    >
      Resolve Conflicts
    </button>
  </form>
</template>

<script>
import Vue from 'vue';
import box_types from '../../consts/box_types.es6';

export default {
  computed: {
    secret_uuid(){ return this.$route.params.secret_uuid; },
    box(){ return this.$parent.box; },
    secret(){
      return this.box.secrets[this.secret_uuid];
    },
    box_type(){
      return box_types.find(box_type => box_type.name === this.box.type);
    },
    fields(){
      if(this.box_type){
        return this.box_type.fields;
      }
      return {};
    },
  },
  methods: {
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
  @import '../../styles/secrets.less';

  form {
    margin-left: -10px;
  }

  .box_name {
    margin-top: 10px;
  }

  .subfields {

  }
</style>
