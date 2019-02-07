<template>
  <form class="wrapper">
    <input v-model="box.name" placeholder="Name">
    <button @click.prevent="add_secret">Add</button>
    <hr />
    <div v-for="secret in box.secrets">
      <input placeholder="name" v-model="secret.name">
      <input placeholder="value" v-model="secret.value">
      <button v-clipboard:copy="secret.value">copy</button>
    </div>
  </form>
</template>

<script>
  export default {
    computed: {
      uuid(){ return this.$route.params.secret_uuid; },
      box(){
        return this.$root.GetSecret(this.uuid);
      },
    },
    methods: {
      copy_value(){
        document.execCommand("copy");
      },
    },
  }
</script>
