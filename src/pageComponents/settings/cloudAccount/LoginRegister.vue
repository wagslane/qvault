<template>
  <div>
    <HeaderBar title="Settings" />
    <div class="options-box">
      <form @submit.prevent="click_continue">
        <div class="body center-text">
          <h1>Cloud Backup Account</h1>
          <h2>All vaults stored by Qvault are encrypted locally to preserve your privacy</h2>
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
            <h3
              v-if="!userCreated"
            >
              Logging in will overwrite your current cloud vault. To download your current vault you must exit the app and start over
            </h3>
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
              @click="showResetCloudPasswordModal"
            >
              Trouble accessing cloud account?
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
    <TimingOverlay
      ref="loader"
    />
    <TimingOverlay
      ref="successOverlay"
      overlay-screen="success"
      title="Vault Saved"
    />
    <confirm
      ref="ResetCloudPassword.vueModal"
      title="Are You Sure?"
      subtitle="If you reset your cloud password then your existing vault will be overwritten"
    />
  </div>
</template>

<script>
import { DeriveCloudKey} from '../../../lib/QVaultCrypto/QVaultCrypto';
import {createUser, resendRegistrationEmail, getToken, setToken} from '../../../lib/CloudClient/CloudClient';
import TimingOverlay from '../../../components/TimingOverlay.vue';
import confirm from '../../../components/Confirm.vue';

export default {
  components:{
    TimingOverlay,
    confirm
  },
  data(){
    return {
      registerTabActive: true,
      emailRegister: null,
      emailLogin: null,
      userCreated: false,
      error: null,
      defaultEmailLogin: ''
    };
  },
  methods: {
    showResetCloudPasswordModal(){
      this.$refs.ResetCloudPassword.vueModal.show(() => {
        this.$router.push({
          name: 'utilityResetCloudPassword', 
          params: {donePath: 'settingsCloudAccountLoginRegister'}
        });
      });
    },
    async resend(){
      this.error = null;
      this.userCreated = false;
      try{
        this.cloudKey = await DeriveCloudKey(this.$root.password);
        await resendRegistrationEmail(this.emailRegister, this.cloudKey);
        this.userCreated = true;
      } catch (err) {
        this.error = err;
      }
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
      const oldEmail = this.$root.email;
      const oldToken = getToken();
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
          this.$root.email = oldEmail;
          setToken(oldToken);
          throw err;
        }
      }

      try{
        await this.$root.SaveBoth();
      } catch (err){
        this.$root.email = oldEmail;
        setToken(oldToken);
        throw `Unable to save vault: ${err}`;
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
      await this.$refs.successOverlay.sleep(1200);
      this.$router.push({name: 'settings'});
    }
  }
};
</script>
