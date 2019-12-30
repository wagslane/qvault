<template>
  <div>
    <HeaderBar title="Setup" />
    <div class="options-box">
      <form @submit.prevent="save">
        <div class="body">
          <StepProgress :filled="3" />
          <h1>Create a Password or Passphrase</h1>
          <h2>
            This password/passphrase unlocks your vault. 
            If you forget it, there is NO WAY to unlock your vault unless you have a 
            recovery code setup.
          </h2>
          <div class="tabs">
            <div 
              class="tab tab-left"
              :class="{ 'tab-active': passwordTabActive }"
              @click="passwordTabActive = true"
            >
              Password
            </div>
            <div 
              class="tab tab-right"
              :class="{ 'tab-active': !passwordTabActive }"
              @click="passwordTabActive = false"
            >
              Passphrase (More Secure)
            </div>
          </div>
          <br>
          <br>
          <div :style="{display: passwordTabActive ? 'block' : 'none'}">
            <h4>
              A password must contain 12 characters, 
              including uppercase, lowercase, a number and special character.
            </h4>
            <DecoratedTextInput
              v-model="password" 
              keyboard-id="password" 
              description="Password"
              :active="passwordTabActive"
              type="password"
            />
            <DecoratedTextInput
              v-model="confirm"
              keyboard-id="confirm"
              description="Confirm"
              type="password"
            />
            <span
              v-if="password && password_error"
              class="form-error"
            >{{ password_error }}</span>
          </div>
          <div
            class="center-text"
            :style="{display: !passwordTabActive ? 'block' : 'none'}"
          >
            <h4>
              A passphrase is a list of words separted by spaces, and must contain at least 15 characters.
              You may optionally generate a random passphrase.
            </h4>
            <DecoratedTextInput
              v-model="passphrase" 
              keyboard-id="passphrase" 
              description="Passphrase"
              :active="!passwordTabActive"
              :default-value="generated"
              type="text"
            />
            <span
              v-if="passphrase && passphrase_error"
              class="form-error"
            >{{ passphrase_error }}</span>
            <br>
            <span
              class="link"
              @click="generatePassphrase"
            > 
              Generate Random Passphrase
            </span>
          </div>
        </div>
        <div class="footer">
          <div
            class="back"
            @click="$router.go(-1)"
          >
            <div class="icon" />
          </div>
          <button
            v-if="(password && !password_error) || (passphrase && !passphrase_error)"
            class="continue"
            type="submit"
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
import {ValidatePassword, ValidatePassphrase, GeneratePassphrase} from '../../lib/QVaultCrypto/QVaultCrypto';

export default {
  data(){
    return {
      passwordTabActive: true,
      passphrase: null,
      password: null,
      confirm: null,
      generated: ''
    };
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
    async save(){
      if (this.passwordTabActive){
        this.$root.password = this.password;
      } else {
        this.$root.password = this.passphrase;
      }
      this.$router.push({name: 'CreateStep4'});
    },
    generatePassphrase(){
      this.generated = GeneratePassphrase(5);
    }
  },
};
</script>
