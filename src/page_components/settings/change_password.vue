<template>
  <div>
    <HeaderBar title="Settings" />
    <div class="options-box">
      <form @submit.prevent="$refs.loader.load">
        <div class="body">
          <h1>Change Password</h1>

          <div v-if="!matched">
            <h2>Enter your old password or passphrase</h2>
            <TextInput
              v-model="old_password"
              :active="true"
              keyboard-i-d="old_password" 
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
              <TextInput
                v-model="password" 
                keyboard-i-d="password" 
                description="Password"
                :active="passwordTabActive"
                type="password"
              />
              <TextInput
                v-model="confirm" 
                keyboard-i-d="confirm" 
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
              <TextInput
                v-model="passphrase" 
                keyboard-i-d="passphrase" 
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
              v-if="cloud_error"
              class="form-error"
            >{{ cloud_error }}</span>
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
    <LoadingOverlay
      ref="loader"
      :func="save"
    />
  </div>
</template>

<script>
import {ValidatePassword, ValidatePassphrase, PassKeyFromPassword, GeneratePassphrase} from '../../lib/QVaultCrypto/QVaultCrypto';
import {updateUserPassword} from '../../lib/CloudClient/CloudClient';
import {DeriveCloudKey} from '../../lib/QVaultCrypto/QVaultCrypto';

export default {
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
    loading_title(){
      return this.matched ? "Updating" : "Validating";
    },
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
    async save(){
      this.error = null;
      if (!this.matched){
        let confirm_key = await PassKeyFromPassword(this.old_password);
        if (confirm_key === this.$root.pass_key){
          this.matched = true;
        } else {
          this.error = "Invalid password";
          this.reset();
        }
        return;
      }

      let new_pass_key = '';
      if (this.passwordTabActive){
        new_pass_key = await PassKeyFromPassword(this.password);
      } else {
        new_pass_key = await PassKeyFromPassword(this.passphrase);
      }

      if (this.$root.email){
        try{
          let old_pass_key = await PassKeyFromPassword(this.old_password);
          let old_cloud_key = await DeriveCloudKey(old_pass_key);
          let new_cloud_key = await DeriveCloudKey(new_pass_key);
          await updateUserPassword(old_cloud_key, new_cloud_key);
        } catch (err){
          this.error = err;
          this.reset();
          return;
        }
      }

      let old_pass_key = this.$root.pass_key;
      this.$root.pass_key = new_pass_key;
      try{
        await this.$root.SaveBoth();
      } catch (err){
        this.error = err;
        this.$root.pass_key = old_pass_key;
        this.reset();
        return;
      }
      this.$router.push({name: 'settings'});
    },
    async generatePassphrase(){
      this.generated = await GeneratePassphrase(5);
    }
  },
};
</script>
