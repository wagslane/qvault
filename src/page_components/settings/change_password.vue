<template>
  <div>
    <HeaderBar title="Settings" />
    <div class="options-box">
      <form @submit.prevent="submit">
        <div class="body">
          <h1>Change Password</h1>

          <div v-if="!matched">
            <h2>Enter your old password or passphrase</h2>
            <DecoratedTextInput
              v-model="old_password"
              :active="true"
              keyboard-id="old_password" 
              description="Old Password" 
              type="password"
            />
            <span
              v-if="error"
              class="form-error"
            >{{ error }}</span>
          </div>

          <div v-if="matched">
            <h2>Enter a new password or passphrase</h2>
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
                Passphrase
              </div>
            </div>
            <br>
            <br>
            <div :style="{display: passwordTabActive ? 'block' : 'none'}">
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
                v-if="password && password_invalid"
                class="form-error"
              >{{ password_invalid }}</span>
            </div>
            <div
              class="center-text"
              :style="{display: !passwordTabActive ? 'block' : 'none'}"
            >
              <DecoratedTextInput
                v-model="passphrase" 
                keyboard-id="passphrase" 
                description="Passphrase"
                :active="!passwordTabActive"
                :default-value="generated"
                type="text"
              />
              <span
                v-if="passphrase && passphrase_invalid"
                class="form-error"
              >{{ passphrase_invalid }}</span>
              <br>
              <span
                class="link"
                @click="generatePassphrase"
              > 
                Generate Random Passphrase
              </span>
            </div>
            <span
              v-if="error"
              class="form-error"
            >{{ error }}</span>
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
            v-if="(password && !password_invalid) || (passphrase && !passphrase_invalid) || (!matched && old_password)"
            class="continue"
            type="submit"
          >
            <span>Continue</span>
            <div class="continue-arrow" />
          </button>
        </div>
      </form>
    </div>
    <timingOverlay
      ref="loader"
    />
    <timingOverlay
      ref="successOverlay"
      overlay-screen="success"
      title="Vault Saved"
    />
  </div>
</template>

<script>
import {ValidatePassword, ValidatePassphrase, GeneratePassphrase} from '../../lib/QVaultCrypto/QVaultCrypto';
import {updateUserPassword} from '../../lib/CloudClient/CloudClient';
import {DeriveCloudKey} from '../../lib/QVaultCrypto/QVaultCrypto';
import timingOverlay from '../../components/timingOverlay.vue';

export default {
  components:{
    timingOverlay
  },
  data(){
    return {
      matched: false,
      passwordTabActive: true,
      old_password: null,
      error: null,
      passphrase: null,
      password: null,
      confirm: null,
      generated: ''
    };
  },
  computed:{
    password_invalid(){
      let err = ValidatePassword(this.password);
      if (err){
        return err;
      }
      if (this.password !== this.confirm){
        return 'Passwords don\'t match';
      }
      return '';
    },
    passphrase_invalid(){
      let err = ValidatePassphrase(this.passphrase);
      if (err){
        return err;
      }
      return '';
    },
  },
  methods:{
    async reset(){
      this.matched = false;
      this.old_password = null;
      this.passphrase = null;
      this.password = null;
      this.confirm = null;
      this.generated = '';
    },
    async change(){
      let newPassword = '';
      if (this.passwordTabActive){
        newPassword = this.password;
      } else {
        newPassword = this.passphrase;
      }

      if (this.$root.email){
        let old_cloud_key = await DeriveCloudKey(this.old_password);
        let new_cloud_key = await DeriveCloudKey(newPassword);
        await updateUserPassword(old_cloud_key, new_cloud_key);
      }

      let rootPassword = this.$root.password;
      this.$root.password = newPassword;
      try{
        await this.$root.SaveBoth();
      } catch (err){
        this.$root.password = rootPassword;
        throw err;
      }
    },
    async submit(){
      this.error = null;
      if (!this.matched){
        if (this.old_password === this.$root.password){
          this.matched = true;
          this.error = null;
        } else {
          this.error = "Invalid password";
          this.reset();
        }
        return;
      }
      try{
        await this.$refs.loader.load(this.change);
      } catch (err) {
        this.reset();
        this.error = err;
        return;
      }
      await this.$refs.successOverlay.sleep(1200);
      this.$router.push({name: 'settings'});
    },
    async generatePassphrase(){
      this.generated = await GeneratePassphrase(5);
    }
  },
};
</script>
