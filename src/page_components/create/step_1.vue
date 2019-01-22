<template>
  <div>
    <router-link
      :to="{name: 'create_step_2'}"
      tag="button"
    >
      Use a Q-Card
    </router-link>
    <button
      @click.prevent="skip_step_2"
    >
      Create without backup
    </button>
  </div>
</template>

<script>
  import {GenerateCharKey} from '../../lib/QVaultCrypto/QVaultCrypto';

  export default {
    methods: {
      async skip_step_2(){
        this.$root.char_key = await GenerateCharKey();
        this.$router.push({name: 'create_step_3'});
      },
    },
  }
</script>
