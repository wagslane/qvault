<template>
  <div>
    <HeaderBar title="Setup" />
    <div class="options-box">
      <div class="body">
        <h1>Get Started</h1>
        <h2>Create a new vault, or open an existing vault</h2>

        <div
          class="btn"
          @click="openExisting"
        >
          Create New Vault
        </div>

        <router-link
          class="btn"
          :to="{name: 'load_choose'}"
        >
          Open Existing Vault
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import {GenerateCharKey} from '../../lib/QVaultCrypto/QVaultCrypto';

export default {
  mounted(){
    try{
      this.$root.LoadLastUsedVault();
      this.$router.push({name: 'load_unlock_step_1'});
    } catch (err){
      // do nothing if cache is empty
    }
  },
  methods:{
    async openExisting(){
      this.$root.char_key = await GenerateCharKey();
      this.$router.push({name: 'create_step_2'});
    }
  }
};
</script>
