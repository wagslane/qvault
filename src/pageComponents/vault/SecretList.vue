<template>
  <div>
    <div id="box-header">
      <input
        v-if="boxDefinition.key === 'other'"
        v-model="box.name"
        placeholder="Name"
        class="box_name box_name_other"
      >
      <div
        v-else
        class="box_name"
      >
        {{ boxDefinition.displayName }}
      </div>
      <DropdownMenu
        class="dropdown-menu"
        :actions="dropdownMenuActions"
        @showDeleteBoxModal="showDeleteBoxModal"
      />
      <button
        class="add-secret"
        @click.prevent="addSecret"
      >
        <PlusSolid />
      </button>
      <button
        v-if="boxDefinition.key === 'passwords'"
        class="import"
        @click.prevent="importPasswordsCSV"
      >
        Import CSV
      </button>
    </div>
    <SecretPreview
      v-for="secretUUID in $root.GetBoxSecretUUIDs($parent.boxUUID)"
      :key="secretUUID"
      :box-u-u-i-d="$parent.boxUUID"
      :secret-u-u-i-d="secretUUID"
    />
    <Confirm
      ref="deleteBoxModal"
      title="Are you sure you want to delete this box?"
    />
  </div>
</template>

<script>
import SecretPreview from './SecretPreview.vue';
import PlusSolid from '../../img/plus-solid.svg.vue';
import DropdownMenu from '../../components/DropdownMenu.vue';
import TrashSVG from '../../img/trash.svg';
import Confirm from '../../components/Confirm.vue';

export default {
  components: {
    SecretPreview,
    PlusSolid,
    DropdownMenu,
    Confirm
  },
  computed: {
    box() {
      return this.$parent.box;
    },
    boxDefinition(){
      return this.$root.GetBoxDefinition(this.$parent.boxUUID);
    },
    dropdownMenuActions(){
      return [
        {
          label: 'Delete Box',
          method: 'showDeleteBoxModal',
          icon: TrashSVG,
        }
      ];
    },
  },
  methods: {
    addSecret(){
      if (this.boxDefinition.key === "cryptoWallets"){
        this.$router.push({
          name: 'VaultCreateCryptoWalletStep1',
          boxUUID: this.$parent.boxUUID
        });
        return; 
      }
      this.$router.push({name: 'Secret', params: {boxUUID: this.$parent.boxUUID}});
    },
    emailValid(email){
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    importPasswordsCSV(){
      try{
        const secrets = this.$root.ReadCSVDialogue();
        for (let secret of secrets){
          if (secret.name === undefined || secret.name === ''){
            continue;
          }
          if (secret.url === undefined || secret.url === ''){
            continue;
          }
          if (secret.username === undefined || secret.username === ''){
            continue;
          }
          if (secret.password === undefined || secret.password === ''){
            continue;
          }
          let newSecret = {
            fields: {
              issuer: secret.name,
              password: secret.password,
              link: secret.url,
            }
          };
          if (this.emailValid(secret.username)){
            newSecret.fields.Email = secret.username;
          }else{
            newSecret.fields.Username = secret.username;
          }
          this.$root.CreateSecret(this.$parent.boxUUID, newSecret);
        }
      } catch (err){
        alert(err);
      }
    },
    showDeleteBoxModal(){
      this.$refs.deleteBoxModal.show(this.deleteBox);
    },
    deleteBox(){
      try{
        this.$root.DeleteBox(this.$parent.boxUUID);
        this.$router.push({name: 'Vault'});
      } catch(err){
        alert(err);
      }
    }
  },
};
</script>

<style lang="less">
  @import '../../styles/colors.less';

  #box-header{
    border-bottom: 1px solid @black-lighter;

    .box_name {
      font-size: 22px;
      border: none;
      border-radius: 6px;
      background: transparent;
      color: @gray-light;
      width: ~'calc(100% - 210px)';
      display: inline-block;
      height: 50px;
      line-height: 60px;
      margin-top: 5px;
      margin-bottom: 5px;
      padding-left: 8px;
      outline: none;
    }

    .box_name_other{

      &:hover{
        border: 1px solid @gray-mid;
      }

      &:focus{
        border: 2px solid @gold-mid;
        outline: none;
      }
    }

    .add-secret {
      border: none;
      background: transparent;
      float: right;
      cursor: pointer;
      margin-top: 20px;
      outline: none;
    }

    .import{
      float: right;
      color: @gold-mid;
      border: 1px solid @gold-mid;
      font-size: 18px;
      margin: 12px;
      background: transparent;
      border-radius: 6px;
      cursor: pointer;
      text-decoration: none;
      height: 35px;
      width: 120px;

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

    .dropdown-menu{
      margin-top: 20px;
      float: right;
    }
  }
</style>
