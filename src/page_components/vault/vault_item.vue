<template>
  <form class="wrapper" v-if="box">
    <input v-model="box.name" placeholder="Name">
    <button
      @click.prevent="$root.CreateSecret(box_uuid)"
    >Add</button>
    <hr />
    <div
      v-for="(secret, secret_uuid) in box.secrets"
      :key="secret_uuid"
      class="secret"
    >
      <input placeholder="name" v-model="secret.name">
      <input placeholder="value" v-model="secret.value">
      <!--<button v-clipboard:copy="secret.value">copy</button>-->
    </div>
    <button @click.prevent="$root.SaveLocalVault()">Save</button>
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
    padding: 25px;
  }

  hr {
    box-sizing: border-box;
    height: 2px;
    width: 728px;
    border: 1px solid #2F3235;
  }
</style>
