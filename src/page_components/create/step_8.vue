<template>
  <div>
    <HeaderBar title="Setup" />
    <div class="options-box">
      <div class="body">
        <StepProgress :filled="8" />
        <h1>Sign up for a Q Vault cloud storage account</h1>

        <form v-if="!(userCreated)" @submit.prevent="create_account">
          <TextInput
              v-model="email" 
              keyboardID="email" 
              description="Email" 
              type="email"/>
          <button
            class="btn"
            type="submit"
          >Register</button>
        </form>

        <p v-if="userCreated">
          Please click the link in your email to verify your account, then log in below.
        </p>
        <p v-if="!userCreated">
          Or login if you already have an account
        </p>
        <button
          class="btn"
          @click="login"
        >Login</button>

        <p> {{error}} </p>
      </div>
      <div class="footer">
        <div class="back" @click="$router.go(-1)" />
      </div>
    </div>
  </div>
</template>

<script>
  import {DeriveCloudKey} from '../../lib/QVaultCrypto/QVaultCrypto';
  import {createUser, authenticate, setToken} from '../../lib/CloudClient/CloudClient';

  export default {
    data(){
      return {
        email: null,
        userCreated: false,
        error: null,
        cloudKey: null
      }
    },
    methods: {
      async create_account(){
        try{
          this.cloudKey = await DeriveCloudKey(this.$root.pass_key)
          await createUser(this.email, this.cloudKey)
          this.userCreated = true
        } catch (err) {
          this.error = err
        }
      },
      async login(){
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
