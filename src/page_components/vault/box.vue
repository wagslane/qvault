<template>
  <div v-if="box">
    <div class="wrapper">
      <input
        v-model="box.name"
        placeholder="Name"
        class="box_name"
      >
      <button
        @click.prevent="$root.CreateSecret(box_uuid)"
        class="add_secret"
      >
        <plus_icon style="height: 22px"></plus_icon>
      </button>
    </div>
    <secret
      v-for="secret_uuid in secret_uuids"
      :key="secret_uuid"
      :secret="box.secrets[secret_uuid]"
      :fields="box.fields"
    ></secret>
    <button
      @click.prevent="save"
      class="save"
    >Save</button>
  </div>
</template>

<script>
  import {authenticate, isLoggedIn, upsertVault} from '../../lib/CloudClient/CloudClient';
  import secret from './secret.vue';
  import plus_icon from '../../img/plus-solid.svg';

  export default {
    components: {
      secret,
      plus_icon,
    },
    computed: {
      box_uuid(){ return this.$route.params.box_uuid; },
      box(){
        if(this.box_uuid){
          return this.$root.GetBox(this.box_uuid);
        }
      },
      secret_uuids(){
        if(this.box){
          return Object.keys(this.box.secrets);
        }
      },
    },
    methods: {
      async save(){
        await this.$root.SaveLocalVault();
        if (this.$root.email){
          if (!isLoggedIn()){
            let cloudKey = await DeriveCloudKey(this.$root.pass_key);
            let body = await authenticate(this.$root.email, cloudKey);
            setToken(body.jwt);
          }
          try{
            let vault = await this.$root.GetSavableVault();
            await upsertVault(vault);
            alert('Vault uploaded successfully!');
          } catch (err){
            alert(err);
          }
        }
      },
//      copy_value(){
//        document.execCommand("copy");
//      },
    },
  }
</script>

<style lang="less" scoped>
  .wrapper {
    border-radius: 6px;
    background-color: #080D0E;
    margin: 25px;
    padding: 15px;

    .box_name {
      font-size: 22px;
      border: none;
      border-radius: 6px;
      background: transparent;
      color: #8C8E8F;
      width: ~'calc(100% - 150px)';
      padding: 10px;
    }

    .add_secret {
      color: white;
      font-size: 22px;
      padding: 10px;
      border: none;
      border-radius: 6px;
      background: transparent;
      float: right;
      cursor: pointer;
    }
  }

  .save {
    padding: 10px;
    font-size: 22px;
    margin: 25px;
    color: #8C8E8F;
    background: transparent;
    border: 1px solid #7E8A95;
    border-radius: 6px;
    cursor: pointer;
  }
</style>
