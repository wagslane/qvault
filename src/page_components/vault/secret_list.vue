<template>
  <div>
    <div id="box-header">
      <input
        v-model="box.name"
        placeholder="Name"
        class="box_name"
        :readonly="box.type != 'Other'"
        :class="{box_name_other: box.type == 'Other'}"
      >
      <dropdown_menu
        class="dropdown-menu"
        :actions="dropdown_menu_actions"
        @showDeleteBoxModal="showDeleteBoxModal"
      />
      <button
        class="add_secret"
        @click.prevent="$parent.add_secret"
      >
        <PlusSolid />
      </button>
      <button
        v-if="box.type === 'Passwords'"
        class="import"
        @click.prevent="importPasswordsCSV"
      >
        Import CSV
      </button>
    </div>
    <secret_preview
      v-for="secret_uuid in secret_uuids"
      :key="secret_uuid"
      :box-uuid="box_uuid"
      :secret-uuid="secret_uuid"
      :secret="box.secrets[secret_uuid]"
      :box-type="box_type"
    />
    <confirm
      ref="deleteBoxModal"
      title="Are you sure you want to delete this box?"
    />
  </div>
</template>

<script>
import box_types from '../../consts/box_types';
import secret_preview from './secret_preview.vue';
import PlusSolid from '../../img/plus-solid.svg.vue';
import dropdown_menu from '../../components/dropdownMenu.vue';
import trash_svg from '../../img/trash.svg';
import confirm from '../../components/confirm.vue';

export default {
  components: {
    secret_preview,
    PlusSolid,
    dropdown_menu,
    confirm
  },
  computed: {
    box_uuid() {
      return this.$parent.box_uuid;
    },
    box() {
      return this.$parent.box;
    },
    box_type(){
      return box_types.find(box_type => box_type.name === this.box.type);
    },
    secret_uuids(){
      if(this.box){
        return Object.keys(this.box.secrets);
      }
      return [];
    },
    dropdown_menu_actions(){
      return [
        {
          label: 'Delete Box',
          method: 'showDeleteBoxModal',
          icon: trash_svg,
        }
      ];
    },
  },
  methods: {
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
            Issuer: secret.name,
            Password: secret.password,
            Link: secret.url,
          };
          if (this.emailValid(secret.username)){
            newSecret.Email = secret.username;
          }else{
            newSecret.Username = secret.username;
          }
          this.$root.SetSecret(this.box_uuid, newSecret);
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
        this.$root.DeleteBox(this.box_uuid);
        this.$router.push({name: 'vault'});
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

    .add_secret {
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
