<template>
  <div class="options-box">
    <h1>Create a password</h1>
    <form @submit.prevent="save_step_3">
      <input
        type="password"
        placeholder="password"
        v-model="password"
        required
      />
      <span v-if="password && password_error">{{password_error}}</span>
      <button
        class="btn"
        type="submit"
        v-if="password && !password_error"
      >Next</button>
    </form>
  </div>
</template>

<script>
  import {ValidatePassword, PassKeyFromPassword} from '../../lib/QVaultCrypto/QVaultCrypto';

  export default {
    data(){
      return {
        password: null,
      }
    },
    computed:{
      password_error(){
        return ValidatePassword(this.password);
      },
    },
    methods:{
      async save_step_3(){
        this.$root.pass_key = await PassKeyFromPassword(this.password);
        this.$router.push({name: 'create_step_4'});
      },
    }
  }
</script>
