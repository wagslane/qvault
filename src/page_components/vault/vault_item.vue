<template>
  <form class="wrapper" v-if="box">
    <input
      v-model="box.name"
      placeholder="Name"
      class="box_name"
    >
    <button
      @click.prevent="$root.CreateSecret(box_uuid)"
      class="add_secret"
    >
      <img src="../../img/plus-solid.svg" style="height: 22px" />
    </button>
    <hr />
    <div
      v-for="(secret, secret_uuid) in box.secrets"
      :key="secret_uuid"
      class="secret"
    >
      <input
        placeholder="name"
        v-model="secret.name"
        class="secret_name"
      >
      <input
        placeholder="value"
        v-model="secret.value"
        class="secret_value"
      >
      <!--<button v-clipboard:copy="secret.value">copy</button>-->
    </div>
    <button
      @click.prevent="$root.SaveLocalVault()"
      class="save"
    >Save</button>
  </form>
</template>

<script>
  export default {
    computed: {
      box_uuid(){ return this.$route.params.box_uuid; },
      box(){
        if(this.box_uuid){
          return this.$root.GetBox(this.box_uuid);
        }
      },
    },
    methods: {
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
    }

    hr {
      box-sizing: border-box;
      height: 2px;
      border: 1px solid #2F3235;
      margin: 10px;
    }

    .secret {
      font-size: 18px;
      margin-bottom: 10px;

      .secret_name {
        padding: 10px;
        border: none;
        border-radius: 6px;
        background: transparent;
        color: white;
        width: ~'calc(50% - 15px)';
        margin-right: 15px;
      }

      .secret_value {
        padding: 10px;
        border: 1px solid #7E8A95;
        border-radius: 6px;
        background: transparent;
        color: #8C8E8F;
        width: ~'calc(50% - 75px)';
        margin-left: 15px;
      }
    }

    .save {
      padding: 10px;
      font-size: 22px;
      margin: 10px;
      color: #8C8E8F;
      background: transparent;
      border: 1px solid #7E8A95;
      border-radius: 6px;
      cursor: pointer;
    }
  }
</style>
