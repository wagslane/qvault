<template>
  <div>
    <HeaderBar title="Setup" />
    <div class="options-box">
      <div class="body">
        <StepProgress :filled="4" />
        <h1>Create Vault Key</h1>
        <h2>Select a security method and create your vault key</h2>
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
            v-if="password && password_error"
            class="form-error"
          >{{ password_error }}</span>
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
            v-if="passphrase && passphrase_error"
            class="form-error"
          >{{ passphrase_error }}</span>
          <br>
          <span
            class="link"
            @click="generatePassphrase"
          > 
            Generate Random Passphrase
          </span>
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
          v-if="(password && !password_error) || (passphrase && !passphrase_error)"
          class="continue"
          @click="$refs.loader.load"
        >
          <span>Continue</span>
          <div class="continue-arrow" />
        </button>
      </div>
    </div>
    <LoadingOverlay
      ref="loader"
      title="Applying Brute-Force Resistance"
      :func="save"
    />
  </div>
</template>

<script>
import {ValidatePassword, ValidatePassphrase, PassKeyFromPassword, GeneratePassphrase} from '../../lib/QVaultCrypto/QVaultCrypto';

export default {
  data(){
    return {
      passwordTabActive: true,
      passphrase: null,
      password: null,
      confirm: null,
      generated: ''
    };
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
      if (this.passwordTabActive){
        this.$root.pass_key = await PassKeyFromPassword(this.password);
      } else {
        this.$root.pass_key = await PassKeyFromPassword(this.passphrase);
      }
      this.$router.push({name: 'create_step_6'});
    },
    async generatePassphrase(){
      this.generated = await GeneratePassphrase(5);
    }
  },
};
</script>
