<template>
  <div
    class="secret-preview"
  >
    <router-link
      :to="{name: 'Secret', params: {boxUUID: boxUuid, secretUUID: secretUuid}}"
      class="secret-link"
    >
      <span class="name">{{ quickAccessName }}</span>
      <div class="arrow" />
    </router-link>
    <div
      v-for="(fieldDefinition, i) in definedQuickAccessDefinitions"
      :key="i"
      class="field"
    >
      <div class="label">
        <label class="name">{{ fieldDefinition.displayName }}</label>
        <label
          v-if="copied === fieldDefinition.key"
          class="copied"
        >Copied to Clipboard!</label>
      </div>
      <input
        v-model="secret.fields[fieldDefinition.key]"
        :type="fields_map[fieldDefinition.key].hidden && hidden ? 'password' : 'text'"
        readonly
        @click="copy(fieldDefinition.key)"
      >
    </div>
    <div
      v-if="definedQuickAccessDefinitions.length === 0"
      class="spacer"
    />
    <dropdown_menu
      class="dropdown-menu"
      :actions="dropdown_menu_actions"
      @showDeleteSecretModal="showDeleteSecretModal"
      @show_hide_secret="show_hide_secret"
    />
    <confirm
      ref="deleteSecretModal"
      title="Are you sure you want to delete this secret?"
    />
  </div>
</template>

<script>
import dropdown_menu from '../../components/DropdownMenu.vue';
import trash_svg from '../../img/trash.svg';
import hide_svg from '../../img/hide.svg';
import confirm from '../../components/Confirm.vue';

export default {
  components: {
    dropdown_menu,
    confirm
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
    boxDefinition:{
      type: Object,
      required: true
    }
  },
  data(){
    return{
      hidden: true,
      copied: ''
    };
  },
  computed: {
    fields_map(){
      let map = {};
      if(this.boxDefinition){
        for (let i = 0; i < this.boxDefinition.fields.length; i++){
          map[this.boxDefinition.fields[i].key] = this.boxDefinition.fields[i];
        }
      }
      return map;
    },
    quickAccessName(){
      if(this.secret.fields[this.boxDefinition.quick_access_name]){
        return this.secret.fields[this.boxDefinition.quick_access_name];
      }
      return "Unnamed Secret";
    },
    definedQuickAccessDefinitions(){
      const existingQuickAccessSecrets = this.boxDefinition.quick_access_secrets.filter(
        key => this.secret.fields[key]
      );
      return this.boxDefinition.fields.filter(
        fieldObj => existingQuickAccessSecrets.includes(fieldObj.key)
      );
    },
    dropdown_menu_actions(){
      let actions = [
        {
          label: 'Delete Secret',
          method: 'showDeleteSecretModal',
          icon: trash_svg,
        }
      ];
      if (this.definedQuickAccessDefinitions.find((fieldDef) => {return this.fields_map[fieldDef.key].hidden;})){
        actions.push({
          label: 'Show / Hide',
          method: 'show_hide_secret',
          icon: hide_svg,
        });
      }
      return actions;
    },
  },
  methods: {
    showDeleteSecretModal(){
      this.$refs.deleteSecretModal.show(this.deleteSecret);
    },
    copy(fieldKey){
      window.nodeAPI.electron.clipboard.writeText(this.secret.fields[fieldKey]);
      this.copied = fieldKey;
      setTimeout(() => {this.copied = '';}, 750);
    },
    deleteSecret(){
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

    .secret-link {
      color: white;
      cursor: pointer;
      text-decoration: none;
      height: 60px;
      margin-top: 10px;

      .name {
        display: inline-block;
        line-height: 60px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 150px;
        margin-right: 8px;
      }

      .arrow {
        display: inline-block;
        margin-top: 23px;
        transform: rotate(45deg);
        box-sizing: border-box;
        height: 12px;
        width: 12px;
        border-top: 1.5px solid @gray-light;
        border-right: 1.5px solid @gray-light;
        float: right;
      }

      &:hover{
        color: @gold-mid;

        .arrow{
          border-top: 1.5px solid @gold-mid;
          border-right: 1.5px solid @gold-mid;
        }
      }
    }

    .spacer{
      flex-grow: 1;
    }

    .field{
      padding-left: 30px;
      flex-grow: 1;

      .label{
        font-size: 12px;
        padding-bottom: 10px;
        border: none;
        background: transparent;
        display: block;

        .name{
          color: @gray-mid;
        }

        .copied{
          color: @gold-mid;
          float: right;
        }
      }

      input{
        padding: 10px;
        border: 1px solid @gray-blue;
        border-radius: 6px;
        background: transparent;
        color: @gray-light;
        width: 100%;
        cursor: pointer;

        &:focus {
          border: 1px solid @gold-mid;
          outline: none;
        }
      }
    }

    .dropdown-menu{
      margin-top: 30px;
    }
  }
</style>
