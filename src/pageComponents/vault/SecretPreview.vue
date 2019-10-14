<template>
  <div
    class="secret-preview"
  >
    <router-link
      :to="{name: 'Secret', params: {boxUUID: boxUUID, secretUUID: secretUUID}}"
      class="secret-link"
    >
      <span class="name">{{ quickAccessName }}</span>
      <div class="arrow" />
    </router-link>
    <div
      v-for="(fieldDefinition, i) in existingQuickAccessDefinitions"
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
        :value="$root.GetFieldValue(boxUUID, secretUUID, fieldDefinition.key)"
        :type="fieldsMap[fieldDefinition.key].hidden && hidden ? 'password' : 'text'"
        readonly
        @click="copy(fieldDefinition.key)"
      >
    </div>
    <div
      v-if="existingQuickAccessDefinitions.length === 0"
      class="spacer"
    />
    <DropdownMenu
      class="dropdown-menu"
      :actions="DropdownMenuActions"
      @showDeleteSecretModal="showDeleteSecretModal"
      @showHideSecret="showHideSecret"
    />
    <confirm
      ref="deleteSecretModal"
      title="Are you sure you want to delete this secret?"
    />
  </div>
</template>

<script>
import DropdownMenu from '../../components/DropdownMenu.vue';
import TrashSVG from '../../img/trash.svg';
import HideSVG from '../../img/hide.svg';
import confirm from '../../components/Confirm.vue';

export default {
  components: {
    DropdownMenu,
    confirm
  },
  props: {
    boxUUID:{
      type: String,
      required: true
    },
    secretUUID:{
      type: String,
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
    boxDefinition(){
      return this.$root.GetBoxDefinition(this.boxUUID);
    },
    fieldsMap(){
      let map = {};
      if(this.boxDefinition){
        for (let i = 0; i < this.boxDefinition.fields.length; i++){
          map[this.boxDefinition.fields[i].key] = this.boxDefinition.fields[i];
        }
      }
      return map;
    },
    quickAccessName(){
      return this.$root.GetSecretQuickAccessName(this.boxUUID, this.secretUUID);
    },
    existingQuickAccessDefinitions(){
      return this.$root.GetExistingQuickAccessDefinitions(this.boxUUID, this.secretUUID);
    },
    DropdownMenuActions(){
      let actions = [
        {
          label: 'Delete Secret',
          method: 'showDeleteSecretModal',
          icon: TrashSVG,
        }
      ];
      if (this.existingQuickAccessDefinitions.find((fieldDef) => {return this.fieldsMap[fieldDef.key].hidden;})){
        actions.push({
          label: 'Show / Hide',
          method: 'showHideSecret',
          icon: HideSVG,
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
      const text = this.$root.GetFieldValue(this.boxUUID, this.secretUUID, fieldKey);
      window.nodeAPI.electron.clipboard.writeText(text);
      this.copied = fieldKey;
      setTimeout(() => {this.copied = '';}, 750);
    },
    deleteSecret(){
      this.$root.DeleteSecret(this.boxUUID, this.secretUUID);
    },
    showHideSecret(){
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
