<template>
  <div>
    <HeaderBar title="Setup" />
    <div class="options-box">
      <div class="body">
        <h1>Get Started</h1>
        <h2>Create a new vault, or open one you've created before</h2>

        <router-link class="btn" :to="{name: 'create_step_2'}">
          Create New Vault
        </router-link>

        <router-link class="btn" :to="{name: 'load'}">
          Open Existing Vault
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    mounted(){
      try{
        this.$root.LoadLastUsedVault();
        this.$router.push({name: 'load_unlock_step_1'});
      } catch (err){
        // do nothing if cache is empty
      }
    }
  }
</script>
