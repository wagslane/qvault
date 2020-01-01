<template>
  <div>
    <HeaderBar title="Setup" />
    <div class="options-box">
      <form @submit.prevent="$refs.loader.load(click_continue)">
        <div class="body center-text">
          <StepProgress :filled="5" />
          <h1>Qvault Cloud Account</h1>
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
            >Logging in overwrites your current cloud vault. To download it instead click here
            </span>
            <br>
            <br>
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
            @click="$router.push({name: 'Vault'});"
          >
            I don't want to store a backup in the cloud
          </div>
          <div
            v-else
            class="link"
            @click="resend"
          >
            Resend verification email
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
    <TimingOverlay
      ref="loader"
    />
  </div>
</template>

<script>
import {DeriveCloudKey} from '../../lib/QVaultCrypto/QVaultCrypto';
import {createUser, resendRegistrationEmail} from '../../lib/cloudClient';
import TimingOverlay from '../../components/TimingOverlay.vue';

export default {
  components:{
    TimingOverlay
  },
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
      this.$router.push({name: 'LoadDownload'});
    },
    async register(){
      let cloudKey = await DeriveCloudKey(this.$root.password);
      await createUser(this.emailRegister, cloudKey);
      this.userCreated = true;
      this.registerTabActive = false;
      this.defaultEmailLogin = this.emailRegister;
      this.emailRegister = null;
    },
    async LoginRegister(){
      // register if needed
      if (this.registerTabActive){
        await this.register();
        return true;
      }
      // login
      try{
        await this.$root.Login(this.emailLogin, this.$root.password);
      } catch (err) {
        throw `Unable to access cloud account: ${err}`;
      }
      // download existing vault to get the hash
      // then ignore it because we are overwriting
      try {
        await this.$root.DownloadVault();
      } catch (err) {
        this.$root.loaded_vault = null;
        // if there are no vaults that's okay
        if (err !== 'No vaults found on server'){
          throw err;
        }
      }
      return false;
    },
    async click_continue(){
      this.error = null;
      this.userCreated = false;
      try{
        const registered = await this.$refs.loader.load(this.LoginRegister);
        if (registered) {return;}
      } catch (err){
        this.error = err;
        return;
      }
      try{
        await this.$root.SaveBoth();
      } catch (err) {
        this.error = err;
        return;
      }
      this.$router.push({name: 'Vault'});
    }
  }
};
</script>
