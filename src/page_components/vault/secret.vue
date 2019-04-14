<template>
  <form
    @submit.prevent="apply"
  >
    <div class="header">
      <input
        v-model="secret[box_type.header_field]"
        placeholder="Name"
        class="box_name"
        readonly
      >
      <button
        class="back"
        @click.prevent="$router.go(-1)"
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
      v-for="field in fields"
      :key="field.name"
      class="secret"
    >
      <label class="secret_name">{{ field.name }}</label>
      <input
        v-if="field.type === String"
        v-model="secret[field.name]"
        :class="{missing: apply_clicked && missing_fields.includes(field.name)}"
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
          class="add_to_sublist"
          @click.prevent="add_to_sublist(field)"
        >
          <PlusSolid />
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
              :class="{missing: apply_clicked && missing_fields.includes(field.name + j + subfield.name)}"
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
      v-if="secret.conflict"
      class="btn btn-warning"
      @click.prevent="resolve_conflicts"
    >
      Resolve Conflicts
    </button>
  </form>
</template>

<script>
import Vue from 'vue';
import box_types from '../../consts/box_types.es6';
import PlusSolid from '../../img/plus-solid.svg.vue';

export default {
  components: {
    PlusSolid,
  },
  data(){
    return{
      secret: {},
      apply_clicked: false
    };
  },
  computed: {
    secret_uuid(){ return this.$route.params.secret_uuid; },
    box(){ return this.$parent.box; },
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
        alert("Please fix the missing fields");
        return;
      }
      this.box.secrets[this.secret_uuid] = JSON.parse(JSON.stringify(this.secret));
      alert("Change applied");
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
  @import '../../styles/secrets.less';

  form {
    margin-left: -10px;
  }

  .subfields {

  }

  .header{
    display: flex;
    flex-direction: row;
    margin-top: 10px;

    .box_name {
      flex-grow: 1;
      flex-basis: 0;
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
</style>
