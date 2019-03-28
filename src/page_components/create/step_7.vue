<template>
  <div>
    <HeaderBar title="Setup" />
    <div class="options-box">
      <form @submit.prevent="click_continue">
        <div class="body center-text">
          <StepProgress :filled="6" />
          <h1>Cloud Backup Account</h1>
          <h2>All vaults stored by Q Vault are encrypted locally to preserve your privacy</h2>
          <div class="tabs">
            <div 
              class="tab tab-left"
              :class="{ 'tab-active': registerTabActive }"
              @click="registerTabActive = true"
            >
              Register
            </div>
            <div 
              class="tab tab-right"
              :class="{ 'tab-active': !registerTabActive }"
              @click="registerTabActive = false"
            >
              Login
            </div>
          </div>
          <br>
          <br>
          <div :style="{display: registerTabActive ? 'block' : 'none'}">
            <TextInput
              v-model="emailRegister"
              :active="registerTabActive"
              keyboard-i-d="emailRegister" 
              description="Email" 
              type="email" 
            />
          </div>
          <div :style="{display: !registerTabActive ? 'block' : 'none'}">
            <TextInput
              v-model="emailLogin"
              :active="!registerTabActive"
              keyboard-i-d="emailLogin" 
              description="Email" 
              type="email"
            />
            <span
              v-if="userCreated"
              class="form-error"
            >
              Please click the link in your email to verify your account, then continue to login.
            </span>
          </div>
          <span class="form-error"> {{ error }} </span>
          <br v-if="error">
          <br v-if="error">
          <router-link
            class="link"
            :to="{name: 'vault'}"
          >
            I don't want to store a backup in the cloud
          </router-link>
          <br>
          <br>
        </div>
        <div class="footer">
          <div
            class="back"
            @click="$router.go(-1)"
          >
            <div class="icon" />
          </div>
          <button
            v-if="emailRegister || emailLogin"
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
import {DeriveCloudKey} from '../../lib/QVaultCrypto/QVaultCrypto';
import {createUser, authenticate, setToken} from '../../lib/CloudClient/CloudClient';

export default {
  data(){
    return {
      registerTabActive: true,
      emailRegister: null,
      emailLogin: null,
      userCreated: false,
      error: null,
      cloudKey: null
    };
  },
  methods: {
    async click_continue(){
      if (this.registerTabActive){
        try{
          this.cloudKey = await DeriveCloudKey(this.$root.pass_key);
          await createUser(this.emailRegister, this.cloudKey);
          this.userCreated = true;
          this.registerTabActive = false;
          this.emailLogin = this.emailRegister;
          this.emailRegister = null;
        } catch (err) {
          this.error = err;
        }
        return;
      }
      try{
        if (!this.cloudKey){
          this.cloudKey = await DeriveCloudKey(this.$root.pass_key);
        }
        let body = await authenticate(this.emailLogin, this.cloudKey);
        setToken(body.jwt);
        this.$root.email = this.emailLogin;
        this.$router.push({name: 'vault'});
      } catch (err) {
        this.error = err;
      }
    }
  }
};
</script>
