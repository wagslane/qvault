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
              keyboardID="old_password" 
              description="Old Password" 
              type="password"/>
            <span class="form-error" v-if="error">{{error}}</span>
          </div>

          <div v-if="matched">
            <h2>Enter a new password or passphrase</h2>
            <div class="tabs">
              <div 
                class="tab tab-left"
                @click="passwordTabActive = true"
                v-bind:class="{ 'tab-active': passwordTabActive }">
                Password
              </div>
              <div 
                class="tab tab-right"
                @click="passwordTabActive = false"
                v-bind:class="{ 'tab-active': !passwordTabActive }">
                Passphrase
              </div>
            </div>
            <br />
            <br />
            <div :style="{display: passwordTabActive ? 'block' : 'none'}">
              <TextInput
                v-model="password" 
                keyboardID="password" 
                description="Password"
                :active="passwordTabActive"
                type="password"/>
              <TextInput
                v-model="confirm" 
                keyboardID="confirm" 
                description="Confirm" 
                type="password"/>
              <span class="form-error" v-if="password && password_invalid">{{password_invalid}}</span>
            </div>
            <div class="center-text" :style="{display: !passwordTabActive ? 'block' : 'none'}">
              <TextInput
                v-model="passphrase" 
                keyboardID="passphrase" 
                description="Passphrase"
                :active="!passwordTabActive"
                :defaultValue="generated"
                type="text"/>
              <span class="form-error" v-if="passphrase && passphrase_invalid">{{passphrase_invalid}}</span>
              <br/>
              <span class="link" @click="generatePassphrase"> 
                Generate Random Passphrase
              </span>
            </div>
            <span class="form-error" v-if="cloud_error">{{cloud_error}}</span>
          </div>
        </div>
        <div class="footer">
          <div class="back" @click="$router.go(-1)">
            <div class="icon" />
          </div>
          <button
            class="continue"
            type="submit"
            v-if="(password && !password_invalid) || (passphrase && !passphrase_invalid) || (!matched && old_password)"
          >
            <span>Continue</span>
            <div class="continue-arrow" />
          </button>
        </div>
      </form>
    </div>
    <LoadingOverlay :title="loading_title" :func="save" ref="loader" />
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
      }
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

        this.$root.pass_key = new_pass_key;
        await this.$root.SaveLocalVault();
        await this.$root.SaveCloudVaultIfEmail();
        this.$router.push({name: 'settings'});
      },
      async generatePassphrase(){
        this.generated = await GeneratePassphrase(5);
      }
    },
  }
</script>
