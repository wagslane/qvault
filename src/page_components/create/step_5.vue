<template>
  <div>
    <HeaderBar title="Setup" />
    <div class="options-box">
      <div class="body">
        <StepProgress :filled="5" />
        <h1>Create Vault Key</h1>
        <h2>Select a security method and create your vault key</h2>
        <div class="tabs">
          <div 
            class="tab tab-left"
            @click="passwordTabActive = true"
            v-bind:class="{ 'tab-active': passwordTabActive }">
            Password
          </div>
          <div 
            class="tab tab-right"
            @click="passwordTabActive = false"
            v-bind:class="{ 'tab-active': !passwordTabActive }">
            Passphrase
          </div>
        </div>
        <br />
        <br />
        <div :style="{display: passwordTabActive ? 'block' : 'none'}">
          <TextInput
            v-model="password" 
            keyboardID="password" 
            description="Password"
            :active="passwordTabActive"
            type="password"/>
          <TextInput
            v-model="confirm" 
            keyboardID="confirm" 
            description="Confirm" 
            type="password"/>
          <h4 v-if="password && password_error">{{password_error}}</h4>
        </div>
        <div :style="{display: !passwordTabActive ? 'block' : 'none'}">
          <TextInput
            v-model="passphrase" 
            keyboardID="passphrase" 
            description="Passphrase"
            :active="!passwordTabActive"
            :defaultValue="generated"
            type="text"/>
            <div
              class="btn"
              @click="generatePassphrase" 
            > 
              Generate Random 
            </div>
          <h4 v-if="passphrase && passphrase_error">{{passphrase_error}}</h4>
        </div>
      </div>
      <div class="footer">
        <div class="back" @click="$router.go(-1)" />
        <button
          class="continue"
          @click="save_step_5"
          v-if="(password && !password_error) || (passphrase && !passphrase_error)"
        >
          <span>Continue</span>
          <div class="continue-arrow" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  import {ValidatePassword, ValidatePassphrase, PassKeyFromPassword, GeneratePassphrase} from '../../lib/QVaultCrypto/QVaultCrypto';

  export default {
    data(){
      return {
        passwordTabActive: true,
        passphrase: null,
        password: null,
        confirm: null,
        generated: ''
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
      passphrase_error(){
        let err = ValidatePassphrase(this.passphrase);
        if (err){
          return err;
        }
        return '';
      },
    },
    methods:{
      async save_step_5(){
        if (this.passwordTabActive){
          this.$root.pass_key = await PassKeyFromPassword(this.password);
        } else {
          this.$root.pass_key = await PassKeyFromPassword(this.passphrase);
        }
        this.$router.push({name: 'create_step_6'});
      },
      async generatePassphrase(){
        this.generated = await GeneratePassphrase(5);
      }
    },
  }
</script>

<style>
.tabs {
  height: 43px;
  width: 478px;
  margin: auto;
}

.tab{
  width: 50%;
  height: 100%;
  background-color: #080D0E;
  color: #858586;
  font-size: 12px;
  letter-spacing: 0.6px;
  line-height: 43px;
  text-align: center;
  cursor: pointer;
}


.tab-left{
  float: left;
  border-radius: 21.5px 0px 0px 21.5px;
}

.tab-right{
  float: left;
  border-radius: 0px 21.5px 21.5px 0px;
}

.tab-active{
  background-color: #CE9B2C;
  color: #080D0E;
}
</style>
