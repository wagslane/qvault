<template>
  <div>
    <HeaderBar title="Setup" />
    <div class="options-box">
      <StepProgress :filled="5" />
      <h1>Create Vault Key</h1>
      <h2>Select a security method and create your vault key.</h2>
      <form @submit.prevent="save_step_3">
        <div class="input-field">
          <div class="description">Password</div>
          <input
            class="text"
            type="password"
            v-model="password"
            required
          />
        </div>
        <div class="input-field">
          <div class="description">Confirm</div>
          <input
            class="text"
            type="password"
            v-model="confirm"
            required
          />
        </div>
        <h4 v-if="password && password_error">{{password_error}}</h4>
        <button
          class="btn"
          type="submit"
          v-if="password && !password_error"
        >Next</button>
      </form>
    </div>
  </div>
</template>

<script>
  import {ValidatePassword, PassKeyFromPassword} from '../../lib/QVaultCrypto/QVaultCrypto';

  export default {
    data(){
      return {
        password: null,
        confirm: null,
      }
    },
    computed:{
      password_error(){
        let err = ValidatePassword(this.password);
        if (err){
          return err;
        }
        if (this.password !== this.confirm){
          return 'Passwords don\'t match';
        }
        return '';
      },
    },
    methods:{
      async save_step_3(){
        this.$root.pass_key = await PassKeyFromPassword(this.password);
        this.$router.push({name: 'create_step_6'});
      },
    },
  }
</script>
