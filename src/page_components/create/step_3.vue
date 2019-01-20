<template>
  <form @submit.prevent="save_step_3">
    <h1>Create the vault key</h1>
    <input
      type="password"
      placeholder="passphrase"
      v-model="passphrase"
      required
    />
    <span v-if="passphrase && passphrase_error">{{passphrase_error}}</span>
    <button
      type="submit"
      v-if="passphrase && !passphrase_error"
    >Next</button>
  </form>
</template>

<script>
  import {ValidatePassword, PassKeyFromPassword} from '../../lib/QVaultCrypto/QVaultCrypto';

  export default {
    data(){
      return {
        passphrase: null,
      }
    },
    computed:{
      passphrase_error(){
        return ValidatePassword(this.passphrase);
      },
    },
    methods:{
      async save_step_3(){
        this.$root.pass_key = await PassKeyFromPassword(this.passphrase);
        this.$router.push({name: 'create_step_4'});
      },
    }
  }
</script>
