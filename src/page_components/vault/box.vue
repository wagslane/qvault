<template>
  <div v-if="box">
    <div class="wrapper">
      <div
        placeholder="Name"
        class="box_name"
        v-text="box.name"
      />
      <button
        class="add_secret"
        @click.prevent="$root.CreateSecret(box_uuid)"
      >
        <plus_icon style="height: 22px" />
      </button>
    </div>
    <secret
      v-for="secret_uuid in secret_uuids"
      :key="secret_uuid"
      :secret_uuid="secret_uuid"
      :box="box"
    />
    <button
      class="save"
      @click.prevent="save"
    >
      Save
    </button>
  </div>
</template>

<script>
  import {authenticate, isLoggedIn, upsertVault} from '../../lib/CloudClient/CloudClient';
  import secret from './secret.vue';

  export default {
    components: {
      secret,
    },
    computed: {
      box_uuid(){ return this.$route.params.box_uuid; },
      box(){
        if(this.box_uuid){
          return this.$root.GetBox(this.box_uuid);
        }
        return {};
      },
      secret_uuids(){
        if(this.box){
          return Object.keys(this.box.secrets);
        }
        return [];
      },
    },
    methods: {
      async save(){
        await this.$root.SaveLocalVault();
        await this.$root.SaveCloudVaultIfEmail();
      },
//      copy_value(){
//        document.execCommand("copy");
//      },
    },
  };
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
      display: inline-block;
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
