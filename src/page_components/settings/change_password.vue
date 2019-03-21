<template>
  <div>
    <HeaderBar title="Settings" />
    <div class="options-box">
      <div class="body">
        <h1>Change Password</h1>

        <div v-if="!matched">
          <h2>Enter your old password or passphrase</h2>
          <TextInput
            v-model="old_password"
            :active="true"
            keyboardID="old_password" 
            description="password" 
            type="password"/>
          <span class="form-error" v-if="old_password && old_password_error">{{old_password_error}}</span>
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
            <span class="form-error" v-if="password && password_error">{{password_error}}</span>
          </div>
          <div class="center-text" :style="{display: !passwordTabActive ? 'block' : 'none'}">
            <TextInput
              v-model="passphrase" 
              keyboardID="passphrase" 
              description="Passphrase"
              :active="!passwordTabActive"
              :defaultValue="generated"
              type="text"/>
            <span class="form-error" v-if="passphrase && passphrase_error">{{passphrase_error}}</span>
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
          @click="$refs.loader.load"
          v-if="(password && !password_error) || (passphrase && !passphrase_error) || (!matched && old_password && !old_password_error)"
        >
          <span>Continue</span>
          <div class="continue-arrow" />
        </button>
      </div>
    </div>
    <LoadingOverlay title="Applying Brute-Force Resistance" :func="save" ref="loader" />
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
        old_password_error: null,
        passphrase: null,
        password: null,
        confirm: null,
        generated: '',
        cloud_error: null
      }
    },
    computed:{
      password_error(){
        let err = ValidatePassword(this.password);
        if (err){
          return err;
        }
        if (this.password !== this.confirm){
          return 'Passwords don\'t match';
        }
        return '';
      },
      passphrase_error(){
        let err = ValidatePassphrase(this.passphrase);
        if (err){
          return err;
        }
        return '';
      },
    },
    methods:{
      async save(){
        if (!this.matched){
          let confirm_key = await PassKeyFromPassword(this.old_password);
          if (confirm_key === this.$root.pass_key){
            this.matched = true;
          } else {
            this.old_password_error = "Invalid password";
          }
          return;
        }

        if (this.passwordTabActive){
          this.$root.pass_key = await PassKeyFromPassword(this.password);
        } else {
          this.$root.pass_key = await PassKeyFromPassword(this.passphrase);
        }

        if (this.$root.email){
          try{
            let old_cloud_key = await DeriveCloudKey(this.confirm_key);
            let new_cloud_key = await DeriveCloudKey(this.$root.pass_key);
            await updateUserPassword(old_cloud_key, new_cloud_key);
          } catch (err){
            this.cloud_error = err;
            return;
          }
        }

        this.$root.SaveLocalVault();
        this.$router.push({name: 'settings'});
      },
      async generatePassphrase(){
        this.generated = await GeneratePassphrase(5);
      }
    },
  }
</script>
