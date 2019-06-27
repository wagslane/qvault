<template>
  <div>
    <HeaderBar title="Setup" />
    <div class="options-box">
      <div class="body">
        <h1>Get Started</h1>
        <h2>Create a new vault, or open an existing vault</h2>

        <div
          class="btn"
          @click="load"
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
    <timingOverlay
      ref="loader"
    />
  </div>
</template>

<script>
import {GenerateCharKey, HashCharKey} from '../../lib/QVaultCrypto/QVaultCrypto';
import timingOverlay from '../../components/timing_overlay.vue';

export default {
  components:{
    timingOverlay
  },
  mounted(){
    try{
      this.$root.LoadLastUsedVault();
      this.$router.push({name: 'load_unlock_step_1'});
    } catch (err){
      // do nothing if cache is empty
    }
  },
  methods:{
    async load(){
      this.$refs.loader.load(this.open_existing);
    },
    async open_existing(){
      this.$root.char_key = await GenerateCharKey();
      this.$root.hashed_char_key = await HashCharKey(this.$root.char_key);
      this.$router.push({name: 'create_step_2'});
    }
  }
};
</script>
