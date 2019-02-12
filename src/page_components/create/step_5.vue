<template>
  <div>
    <HeaderBar title="Setup" />
    <div class="options-box">
      <form @submit.prevent="save_step_3">
        <div class="body">
          <StepProgress :filled="5" />
          <h1>Create Vault Key</h1>
          <h2>Select a security method and create your vault key</h2>
          <div class="tabs">
            <div 
              class="tab tab-left" 
              v-bind:class="{ 'tab-active': passwordTabActive }">
              Password
            </div>
            <div 
              class="tab tab-right" 
              v-bind:class="{ 'tab-active': !passwordTabActive }">
              Passphrase
            </div>
          </div>
            <TextInput
              v-model="password" 
              keyboardID="password" 
              description="Password" 
              type="password"/>
            <TextInput
              v-model="confirm" 
              keyboardID="confirm" 
              description="Confirm" 
              type="password"/>
            <h4 v-if="password && password_error">{{password_error}}</h4>
        </div>
        <div class="footer">
          <div class="back" @click="$router.go(-1)" />
          <button
              class="continue"
              type="submit"
              v-if="password && !password_error"
            >
            <span>Continue</span>
            <div class="continue-arrow" />
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import {ValidatePassword, PassKeyFromPassword} from '../../lib/QVaultCrypto/QVaultCrypto';

  export default {
    data(){
      return {
        passwordTabActive: true,
        passphrase: null,
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

<style>
.tabs {
	height: 43px;
	width: 478px;
	border-radius: 21.5px;
	background-color: #080D0E;
  color: #858586;
  font-size: 12px;
	letter-spacing: 0.6px;
	line-height: 43px;
	text-align: center;
  overflow: hidden;
  margin: auto;
}

.tab{
  width: 50%;
  height: 100%;
}

.tab-left{
  float: left;
}

.tab-right{
  float: left;
}

.tab-active{
 background-color: #CE9B2C;
 color: #080D0E;
}
</style>