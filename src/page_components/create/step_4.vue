<template>
  <form @submit.prevent="create_vault_file">
    <h2>Choose where you'll save your vault file:</h2>
    <button @click.prevent="$root.SaveLocalVaultDialog">Choose location</button>
    <div v-if="$root.local_vault_path">{{$root.local_vault_path}}</div>
    <button type="submit" v-if="$root.local_vault_path">Next</button>
  </form>
</template>

<script>
  export default {
    methods:{
      create_vault_file(){
        this.$root.CreateLocalVault();
        this.$router.push({name: 'create_step_5'});
      },
    },
  }
</script>
