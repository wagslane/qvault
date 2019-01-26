<template>
  <div class="modal">
    <div class="content">
      <h1 class="get-started">Key Backup</h1>
      <h2>Create a new vault, or open one you've created before.</h2>
      <button
        @click.prevent="next = 'create_step_2'"
        class="btn"
        :class="{'btn-selected': next == 'create_step_2'}"
      >Add Qvault Card</button>
      <button
        @click.prevent="next = 'create_step_3'"
        class="btn"
        :class="{'btn-selected': next == 'create_step_3'}"
      >Create Without Backup</button>
    </div>
    <div class="bottom">
      <router-link :to="{name: next}">Continue</router-link>
    </div>
  </div>
</template>

<script>
  import {GenerateCharKey} from '../../lib/QVaultCrypto/QVaultCrypto';

  export default {
    data(){
      return {
        next: 'create_step_2',
      }
    },
    async mounted(){
      this.$root.char_key = null;
      this.$root.char_key = await GenerateCharKey();
    },
  }
</script>
