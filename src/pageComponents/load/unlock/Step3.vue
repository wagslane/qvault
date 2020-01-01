<template>
  <div>
    <HeaderBar title="Load" />
    <div class="options-box">
      <div class="body">
        <h1>Create Vault Key</h1>
        <h2>Select a security method and create your new vault key</h2>
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
            v-if="password && password_error"
            class="form-error"
          >{{ password_error }}</span>
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
        <span
          v-if="saveError"
          class="form-error"
        >{{ saveError }}</span>
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
          @click="$refs.loader.load(save)"
        >
          <span>Continue</span>
          <div class="continue-arrow" />
        </button>
      </div>
    </div>
    <TimingOverlay
      ref="loader"
    />
  </div>
</template>

<script>
import {ValidatePassword, ValidatePassphrase, GeneratePassphrase} from '../../../lib/QVaultCrypto/QVaultCrypto';
import TimingOverlay from '../../../components/TimingOverlay.vue';

export default {
  components:{
    TimingOverlay
  },
  data(){
    return {
      passwordTabActive: true,
      passphrase: null,
      password: null,
      confirm: null,
      generated: '',
      saveError: null
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
        this.$root.password = this.password;
      } else {
        this.$root.password = this.passphrase;
      }
      try{
        this.$root.SaveLocalVault();
      } catch (err){
        this.saveError = err;
      }
      this.$router.push({name: 'Vault'});
    },
    generatePassphrase(){
      this.generated = GeneratePassphrase(5);
    }
  },
};
</script>
