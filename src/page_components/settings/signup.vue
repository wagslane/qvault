<template>
  <div>
    <HeaderBar title="Settings" />
    <div class="options-box">
      <form @submit.prevent="$refs.loader.load">
        <div class="body center-text">
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
            <DecoratedTextInput
              v-model="emailRegister"
              :active="registerTabActive"
              keyboard-id="emailRegister" 
              description="Email" 
              type="email"
            />
          </div>
          <div :style="{display: !registerTabActive ? 'block' : 'none'}">
            <DecoratedTextInput
              v-model="emailLogin"
              :default-value="defaultEmailLogin"
              :active="!registerTabActive"
              keyboard-id="emailLogin" 
              description="Email" 
              type="email"
            />
            <span
              v-if="userCreated"
              class="form-success"
            >
              Please click the link in your email to verify your account, then continue to login.
            </span>
          </div>
          <span
            v-if="error"
            class="form-error"
          > {{ error }} </span>
          <br v-if="error">
          <br v-if="error">
          <div v-if="!registerTabActive">
            <div
              class="link"
              @click="$router.push({name: 'settings_restore_password'});"
            >
              Restore cloud access to this vault
            </div>
          </div>
          <div v-else>
            <div
              class="link"
              @click="resend"
            >
              Resend verification email
            </div>
          </div>
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
            v-if="emailRegister && registerTabActive"
            class="continue"
            type="submit"
          >
            <span>Register</span>
            <div class="continue-arrow" />
          </button>
          <button
            v-if="emailLogin && !registerTabActive"
            class="continue"
            type="submit"
          >
            <span>Login</span>
            <div class="continue-arrow" />
          </button>
        </div>
      </form>
    </div>
    <LoadingOverlay
      ref="loader"
      title="Registering"
      :func="click_continue"
    />
  </div>
</template>

<script>
import {DeriveCloudKey} from '../../lib/QVaultCrypto/QVaultCrypto';
import {createUser, authenticate, setToken, resendRegistrationEmail} from '../../lib/CloudClient/CloudClient';

export default {
  data(){
    return {
      registerTabActive: true,
      emailRegister: null,
      emailLogin: null,
      userCreated: false,
      error: null,
      cloudKey: null,
      defaultEmailLogin: ''
    };
  },
  methods: {
    async resend(){
      this.error = null;
      this.userCreated = false;
      try{
        this.cloudKey = await DeriveCloudKey(this.$root.pass_key);
        await resendRegistrationEmail(this.emailRegister, this.cloudKey);
        this.userCreated = true;
      } catch (err) {
        this.error = err;
      }
    },
    async click_continue(){
      this.error = null;
      this.userCreated = false;
      if (this.registerTabActive){
        try{
          this.cloudKey = await DeriveCloudKey(this.$root.pass_key);
          await createUser(this.emailRegister, this.cloudKey);
          this.userCreated = true;
          this.registerTabActive = false;
          this.defaultEmailLogin = this.emailRegister;
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
        await this.$root.GetVault();
      } catch (err) {
        // If no vault is found that is okay
        if (err === "No vaults found on server"){
          this.$root.email = this.emailLogin;
          this.$router.push({name: 'settings'});
        }
        this.error = err;
        return;
      }
      try{
        await this.$root.UnlockVaultPasskey(this.$root.pass_key);
      } catch(err){
        this.error = "Unable to unlock cloud vault. Try downloading it after exiting this vault.";
        return;
      }
      this.$root.email = this.emailLogin;
      this.$router.push({name: 'settings'});
    }
  }
};
</script>
