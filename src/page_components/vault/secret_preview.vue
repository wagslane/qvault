<template>
  <div
    class="secret-preview"
    :class="{'conflict': secret.conflict}"
  >
    <router-link
      :to="{name: 'secret', params: {box_uuid: boxUuid, secret_uuid: secretUuid}}"
      class="secret-link"
    >
      <span class="name">{{ quickAccessName }}</span>
      <div class="arrow" />
    </router-link>
    <div
      v-for="(fieldname, i) in definedQuickAccessSecrets"
      :key="i"
      class="field"
    >
      <label>{{ fieldname }}</label>
      <input
        v-model="secret[fieldname]"
        :type="fields_map[fieldname].hidden && hidden ? 'password' : 'text'"
        readonly
      >
    </div>
    <dropdown_menu
      :actions="dropdown_menu_actions"
      @delete_secret="delete_secret"
      @show_hide_secret="show_hide_secret"
    />
  </div>
</template>

<script>
import dropdown_menu from '../../components/dropdown_menu.vue';
import trash_svg from '../../img/trash.svg';
import hide_svg from '../../img/hide.svg';

export default {
  components: {
    dropdown_menu,
  },
  props: {
    boxUuid:{
      type: String,
      required: true
    },
    secretUuid:{
      type: String,
      required: true
    },
    secret:{
      type: Object,
      required: true
    },
    boxType:{
      type: Object,
      required: true
    }
  },
  data(){
    return{
      hidden: true,
    };
  },
  computed: {
    fields_map(){
      let map = {};
      if(this.boxType){
        for (let i = 0; i < this.boxType.fields.length; i++){
          map[this.boxType.fields[i].name] = this.boxType.fields[i];
        }
      }
      return map;
    },
    quickAccessName(){
      if(this.secret[this.boxType.quick_access_name]){
        return this.secret[this.boxType.quick_access_name];
      }
      return "Unnamed Secret";
    },
    definedQuickAccessSecrets(){
      return this.boxType.quick_access_secrets.filter(
        fieldname => this.secret[fieldname]
      );
    },
    dropdown_menu_actions(){
      return [
        {
          label: 'Delete Secret',
          method: 'delete_secret',
          icon: trash_svg,
        },
        {
          label: 'Show / Hide',
          method: 'show_hide_secret',
          icon: hide_svg,
        }
      ];
    },
  },
  methods: {
    delete_secret(){
      this.$root.DeleteSecret(this.boxUuid, this.secretUuid);
    },
    show_hide_secret(){
      this.hidden = !this.hidden;
    }
  },
};
</script>

<style lang="less">
  @import '../../styles/colors.less';

  .secret-preview {
    display: flex;
    flex-direction: row;
    margin-top: 15px;

    &.conflict {
      .secret-link {
        .name {
          color: @red-mid !important;
        }
      }
    }

    .secret-link {
      color: white;
      cursor: pointer;
      flex-basis: 160px;
      text-decoration: none;
      height: 60px;

      .name {
        display: inline-block;
        line-height: 60px;
      }

      .arrow {
        display: inline-block;
        margin-top: 16px;
        transform: rotate(45deg);
        box-sizing: border-box;
        height: 12px;
        width: 12px;
        border-top: 1.5px solid @gray-light;
        border-right: 1.5px solid @gray-light;
      }

      &:hover{
        color: @gold-mid;

        .arrow{
          border-top: 1.5px solid @gold-mid;
          border-right: 1.5px solid @gold-mid;
        }
      }
    }

    .field{
      padding-left: 30px;
      flex-grow: 1;

      label{
        font-size: 12px;
        padding-bottom: 10px;
        border: none;
        background: transparent;
        color: @gray-mid;
        display: block;
      }

      input{
        padding: 10px;
        border: 1px solid @gray-blue;
        border-radius: 6px;
        background: transparent;
        color: @gray-light;
        width: 100%;
      }
    }

    .dropdown_menu_icon {
      color: white;
      line-height: 60px;
    }
  }
</style>
