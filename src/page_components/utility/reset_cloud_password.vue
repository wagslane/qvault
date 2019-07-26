<template>
  <div>
    <HeaderBar title="Setup" />
    <div class="options-box">
      <form @submit.prevent="$refs.loader.load(click_continue)">
        <div class="body center-text">
          <h1>Reset Cloud Password</h1>
          <h2>
            If you can't login to your cloud account you can reset your cloud password using your email address
          </h2>
          <h3>
            Your cloud account password is calculated from your vault password.
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
            description="Code from email" 
            type="text" 
          />
          <DecoratedTextInput
            v-if="!usingExistingPassword"
            v-model="password"
            :style="{ display: emailSent ? 'block' : 'none'}"
            keyboard-id="password"
            description="New Password (must match vault password)" 
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
    <timingOverlay
      ref="loader"
    />
  </div>
</template>

<script>
import {DeriveCloudKey, ValidatePassword} from '../../lib/QVaultCrypto/QVaultCrypto';
import {updateUserPasswordEmail, authenticate, emailPasswordCode} from '../../lib/CloudClient/CloudClient';
import timingOverlay from '../../components/timingOverlay.vue';

export default {
  components:{
    timingOverlay
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
    async click_continue(){
      if (!this.emailSent){
        this.emailSent = false;
        this.error = null;
        try{
          await emailPasswordCode(this.email);
        } catch (err) {
          this.error = err;
          return;
        }
        this.emailSent = true;
      }else{
        try{
          let err = ValidatePassword(this.password);
          if (err != ""){
            this.error = err;
            return;
          }
          let cloudKey = await DeriveCloudKey(this.password);
          await updateUserPasswordEmail(this.code, cloudKey);
          await authenticate(this.email, cloudKey);
        } catch (err) {
          this.error = err;
          return;
        }
        alert('Cloud password changed successfully');
        this.$router.push({name: this.donePath});
      }
    },
  }
};
</script>
