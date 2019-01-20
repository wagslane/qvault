<template>
  <form @submit.prevent="save_step_2">
    <div v-if="$root.char_key">
      <h2>Write the following characters on your Q-Card:</h2>
      <h3>{{$root.char_key}}</h3>
      <button type="submit">Next</button>
    </div>
    <div v-else>
      <h2>Generating encryption key, please wait...</h2>
    </div>
  </form>
</template>

<script>
  import {GenerateCharKey} from '../../lib/QVaultCrypto/QVaultCrypto';

  export default {
    mounted(){
      this.generate_key();
    },
    methods:{
      async generate_key(){
        this.$root.char_key = await GenerateCharKey();
      },
      save_step_2(){
        this.$router.push({name: 'create_step_3'})
      },
    },
  }
</script>
