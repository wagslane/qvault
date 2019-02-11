<template>
  <div>
    <HeaderBar title="Setup" />
    <div class="options-box">
      <div class="body">
        <StepProgress :filled="8" />
        <h1>Sign up for a Q Vault cloud storage account</h1>

        <form v-if="!(success)" @submit.prevent="create_account">
          <TextInput
              v-model="email" 
              keyboardID="email" 
              description="Email" 
              type="email"/>
          <button
            class="btn"
            type="submit"
          >Create</button>
        </form>

        <div v-if="success">
          <p>
            Please click the link in your email to verify your account, then log in below.
          </p>
          <button
            class="btn"
            @click="login"
          >Login</button>
        </div>

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
        success: false,
        error: null,
        cloudKey: null
      }
    },
    methods: {
      async create_account(){
        try{
          this.cloudKey = await DeriveCloudKey(this.$root.pass_key)
          await createUser(this.email, this.cloudKey)
          this.success = true
        } catch (err) {
          this.error = err
        }
      },
      async login(){
        try{
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
