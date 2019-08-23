<template>
  <div>
    <HeaderBar title="Setup" />
    <div class="options-box">
      <form @submit.prevent="clickContinue">
        <div class="body center-text">
          <h1>Reset Cloud Password</h1>
          <h2>
            If you can't login to your cloud account you can reset your cloud password using your email address
          </h2>
          <h3>
            Cloud servers never have access to your vault passwords or passphrases
          </h3>

          <DecoratedTextInput
            v-model="email"
            :style="{ display: emailSent ? 'none' : 'block'}"
            keyboard-id="email"
            description="Email" 
            type="email" 
          />
          <DecoratedTextInput
            v-model="code"
            :style="{ display: emailSent ? 'block' : 'none'}"
            keyboard-id="code" 
            description="Code from Email" 
            type="text" 
          />
          <DecoratedTextInput
            v-if="!usingExistingPassword"
            v-model="password"
            :style="{ display: emailSent ? 'block' : 'none'}"
            keyboard-id="password"
            description="New Password" 
            type="password" 
          />
          <span
            v-if="error"
            class="form-error"
          > {{ error }} </span>
        </div>
        <div class="footer">
          <div
            class="back"
            @click="$router.go(-1)"
          >
            <div class="icon" />
          </div>

          <button
            v-if="(emailValid && !emailSent) || (code && emailSent)"
            class="continue"
            type="submit"
          >
            <span v-if="!emailSent">Email a Restore Code</span>
            <span v-else>Restore Access</span>
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
      title="Cloud Password Updated"
    />
  </div>
</template>

<script>
import {DeriveCloudKey, ValidatePassword, ValidatePassphrase} from '../../lib/QVaultCrypto/QVaultCrypto';
import {updateUserPasswordEmail, authenticate, emailPasswordCode} from '../../lib/cloudClient';
import TimingOverlay from '../../components/TimingOverlay.vue';

export default {
  components:{
    TimingOverlay
  },
  props: {
    donePath:{
      type: String,
      required: true,
    }
  },
  data(){
    return {
      emailSent: false,
      email: null,
      error: null,
      code: null,
      password: null,
      usingExistingPassword: false
    };
  },
  computed:{
    emailValid(){
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
    }
  },
  mounted(){
    if(this.$root.password){
      this.password = this.$root.password;
      this.usingExistingPassword = true;
    }
  },
  methods: {
    async sendEmail(){
      await emailPasswordCode(this.email);
      this.emailSent = true;
    },
    async resetPassword(){
      let err1 = ValidatePassword(this.password);
      let err2 = ValidatePassphrase(this.password);
      if (err1 != "" && err2 != ""){
        throw `${err1} or ${err2}`;
      }
      let cloudKey = await DeriveCloudKey(this.password);
      await updateUserPasswordEmail(this.code, cloudKey);
      await authenticate(this.email, cloudKey);
    },
    async clickContinue(){
      this.error = null;
      if (!this.emailSent){
        try{
          await this.$refs.loader.load(this.sendEmail);
        } catch (err){
          this.error = err;
        }
        return;
      }
      try{
        await this.$refs.loader.load(this.resetPassword);
      } catch (err){
        this.error = err;
        return;
      }
      await this.$refs.successOverlay.sleep(1200);
      this.$router.push({name: this.donePath});
    },
  }
};
</script>
