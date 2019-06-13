<template>
  <div>
    <HeaderBar title="Setup" />
    <div class="options-box">
      <form @submit.prevent="$refs.loader.load">
        <div class="body center-text">
          <StepProgress :filled="6" />
          <h1>Q Vault Cloud Account</h1>
          <h2>Vaults are stored locally as well as in the cloud. Vaults are encrypted locally to preserve your privacy</h2>
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
            <span
              v-if="!userCreated"
              class="link"
              @click="toDownload"
            >Logging in will overwrite your current cloud vault. To download your current vault click here
            </span>
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
          <div
            v-if="registerTabActive"
            class="link"
            @click="$router.push({name: 'vault'});"
          >
            I don't want to store a backup in the cloud
          </div>
          <div
            v-if="!registerTabActive"
            class="link"
            @click="resend"
          >
            Resend verification email
          </div>
          <br>
          <br>
          <div
            v-if="!registerTabActive"
            class="link"
            @click="$router.push({name: 'settings_restore_password'});"
          >
            Restore cloud access to this vault
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
import {createUser, resendRegistrationEmail} from '../../lib/CloudClient/CloudClient';

export default {
  data(){
    return {
      registerTabActive: true,
      emailRegister: null,
      emailLogin: null,
      defaultEmailLogin: '',
      userCreated: false,
      error: null
    };
  },
  methods: {
    async resend(){
      this.userCreated = false;
      this.error = null;
      try{
        let cloudKey = await DeriveCloudKey(this.$root.password);
        await resendRegistrationEmail(this.emailLogin, cloudKey);
        this.userCreated = true;
      } catch (err) {
        this.error = err;
      }
    },
    toDownload(){
      this.$root.ResetStorageState();
      this.$router.push({name: 'load_download'});
    },
    async register(){
      let cloudKey = await DeriveCloudKey(this.$root.password);
      await createUser(this.emailRegister, cloudKey);
      this.userCreated = true;
      this.registerTabActive = false;
      this.defaultEmailLogin = this.emailRegister;
      this.emailRegister = null;
    },
    async click_continue(){
      this.error = null;
      this.userCreated = false;
      if (this.registerTabActive){
        try{
          this.register();
        } catch (err) {
          this.error = err;
        }
        return;
      }
      try{
        await this.$root.Login(this.emailLogin, this.$root.password);
        await this.$root.SaveBoth();
        this.$router.push({name: 'vault'});
      } catch (err) {
        this.error = err;
      }
    }
  }
};
</script>
