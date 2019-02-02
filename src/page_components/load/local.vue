<template>
  <form @submit.prevent="open">
    <h1>Unlock Vault</h1>
    <button @click.prevent="$root.OpenLocalVault">
      Choose Vault File
    </button>
    <div>{{$root.local_vault_path}}</div>
    <input type="password" v-model="password" required />
    <button
      type="submit"
      :disabled="!($root.local_vault_path && password)"
    >Open</button>
  </form>
</template>

<script>
  export default {
    data(){
      return {
        password: null,
      }
    },
    methods: {
      async open(){
        await this.$root.LoadLocalVault(this.password);
        this.$router.push({name: 'vault'});
      },
    },
  }
</script>
