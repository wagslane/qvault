<template>
  <div>
    <HeaderBar title="Setup" />
    <div class="options-box">
      <form @submit.prevent="$refs.loader.load">
        <div class="body center-text">
          <StepProgress :filled="6" />
          <h1>Restore Cloud Access</h1>
          <h2>
            If you remember the password to the vault that used to be associated to this cloud account, 
            start over and choose to download an existing vault
          </h2>
          <h3>
            If you restore access to your cloud account here, you will lose any vault data previously stored in the cloud
          </h3>
          <h3>
            After restoring access, the password you created for this vault will be associated with your cloud account
          </h3>

          <TextInput
            v-if="!emailSent"
            v-model="email"
            keyboard-id="emailRegister" 
            description="Email" 
            type="email" 
          />
          <TextInput
            v-else
            v-model="code"
            keyboard-id="code" 
            description="Paste code here" 
            type="text" 
          />
          <span class="form-error"> {{ error }} </span>
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
            <span>Continue</span>
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
import {updateUserPasswordEmail, authenticate, setToken, emailPasswordCode} from '../../lib/CloudClient/CloudClient';

export default {
  data(){
    return {
      emailSent: false,
      email: null,
      error: null,
      code: null
    };
  },
  computed:{
    emailValid(){
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
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
        alert("email sent");
        this.emailSent = true;
      }else{
        try{
          let cloudKey = await DeriveCloudKey(this.$root.pass_key);
          await updateUserPasswordEmail(this.code, cloudKey);
          let body = await authenticate(this.email, cloudKey);
          setToken(body.jwt);
          this.$root.email = this.email;
          await this.$root.SaveBoth();
        } catch (err) {
          this.$root.email = null;
          this.error = err;
          return;
        }
        this.$router.push({name: 'vault'});
      }
    },
  }
};
</script>
