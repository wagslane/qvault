<template>
  <form
    v-if="secret"
    class="wrapper"
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
      <div v-if="field.type === Array">
        <button
          @click.prevent="add_to_sublist(field)"
        >
          <plus_icon style="height: 22px" />
        </button>
        <div
          v-for="(subvalue, j) in secret[field.name]"
          :key="j"
        >
          <div
            v-for="subfield in field.subfields"
            :key="subfield.name"
            class="subfield"
          >
            <label class="secret_name">{{ subfield.name }}</label>
            <input
              v-if="subfield.type === String"
              v-model="subvalue[subfield.name]"
              placeholder="value"
              class="secret_value"
            >
          </div>
        </div>
      </div>
      <!--<button v-clipboard:copy="secret[field]">copy</button>-->
    </div>
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
  },
};
</script>

<style lang="less" scoped>
  @import '../../styles/secrets.less';
</style>
