<template>
  <form @submit.prevent="create_vault_file">
    <h1>Choose where you'll save your vault file:</h1>
    <button class="btn" @click.prevent="$root.SaveLocalVaultDialog">Choose location</button>
    <h3 v-if="$root.local_vault_path">{{$root.local_vault_path}}</h3>
    <button class="btn" type="submit" v-if="$root.local_vault_path">Next</button>
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
