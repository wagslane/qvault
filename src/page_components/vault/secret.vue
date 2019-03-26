<template>
  <form
    v-else
    class="wrapper"
  >
    <input
      v-model="secret[box_type.header_field]"
      placeholder="Name"
      class="box_name"
      readonly
    >
    <hr />
    <div
      v-for="field in fields"
      class="secret"
    >
      <label class="secret_name">{{field.name}}</label>
      <input
        v-if="field.type === String"
        placeholder="value"
        v-model="secret[field.name]"
        class="secret_value"
      >
      <button
        v-if="field.type === Array"
        @click.prevent="add_to_sublist(field)"
      ><plus_icon style="height: 22px"></plus_icon></button>
      <div
        v-if="field.type === Array"
        v-for="subvalue in secret[field.name]"
      >
        <div
          class="subfield"
          v-for="subfield in field.subfields"
        >
          <label class="secret_name">{{subfield.name}}</label>
          <input
            v-if="subfield.type === String"
            placeholder="value"
            v-model="subvalue[subfield.name]"
            class="secret_value"
          >
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
    props: {
      'box': {
        type: Object,
        required: true,
      },
      'secret_uuid': {
        type: String,
        required: true,
      },
    },
    computed: {
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
          Vue.set(new_value, subfield.name, value)
        }
        this.secret[field.name].push(new_value);
      },
    },
  }
</script>

<style lang="less" scoped>
  @import '../../styles/secrets.less';
</style>
