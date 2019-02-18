<template>
  <div>
    <HeaderBar title="Setup" />
    <div class="options-box">
      <form @submit.prevent="click_continue">
        <div class="body">
          <StepProgress :filled="8" />
          <h1>Sign up for a Q Vault cloud storage account</h1>
          <div class="tabs">
            <div 
              class="tab tab-left"
              @click="registerTabActive = true"
              v-bind:class="{ 'tab-active': registerTabActive }">
              Register
            </div>
            <div 
              class="tab tab-right"
              @click="registerTabActive = false"
              v-bind:class="{ 'tab-active': !registerTabActive }">
              Login
            </div>
          </div>
          <br />
          <br />
          <div :style="{display: registerTabActive ? 'block' : 'none'}">
            <TextInput
              v-model="emailRegister"
              :active="true"
              keyboardID="emailRegister" 
              description="Email" 
              type="email"/>
            <p v-if="userCreated">
              Please click the link in your email to verify your account, then login.
            </p>
          </div>
          <div :style="{display: !registerTabActive ? 'block' : 'none'}">
            <TextInput
              v-model="emailLogin"
              :active="true"
              keyboardID="emailLogin" 
              description="Email" 
              type="email"/>
          </div>

          <p> {{error}} </p>
        </div>
        <div class="footer">
          <div class="back" @click="$router.go(-1)">
            <div class="icon" />
          </div>
          <button
            class="continue"
            type="submit"
            v-if="emailRegister || emailLogin"
          >
            <span>Continue</span>
            <div class="continue-arrow" />
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import {DeriveCloudKey} from '../../lib/QVaultCrypto/QVaultCrypto';
  import {createUser, authenticate, setToken} from '../../lib/CloudClient/CloudClient';

  export default {
    data(){
      return {
        registerTabActive: true,
        emailRegister: null,
        emailLogin: null,
        userCreated: false,
        error: null,
        cloudKey: null
      }
    },
    methods: {
      async click_continue(){
        if (registerTabActive){
          try{
            this.cloudKey = await DeriveCloudKey(this.$root.pass_key)
            await createUser(this.email, this.cloudKey)
            this.userCreated = true
          } catch (err) {
            this.error = err
          }
          return
        }
        try{
          if (!this.cloudKey){
            this.cloudKey = await DeriveCloudKey(this.$root.pass_key)
          }
          let body = await authenticate(this.email, this.cloudKey)
          setToken(body.jwt)
          this.$router.push({name: 'vault'});
        } catch (err) {
          this.error = err
        }
      }
    }
  }
</script>
