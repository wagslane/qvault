<template>
  <div>
    <HeaderBar title="Load" />
    <div class="options-box">
      <form @submit.prevent="load">
        <div class="body">
          <h1>Load From Cloud</h1>
          <h2>Download your vault from the Q Vault servers</h2>
            <TextInput
              v-model="email" 
              keyboardID="email" 
              description="email" 
              type="email"/>
            <TextInput
              v-model="password" 
              keyboardID="password" 
              description="password" 
              type="password"/>
            <p>{{error}}</p>
        </div>
        <div class="footer">
          <div class="back" @click="$router.go(-1)" />
          <button
            class="continue"
            type="submit"
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
  import {DeriveCloudKey} from '../../../lib/QVaultCrypto/QVaultCrypto';
  import {authenticate, setToken, getVault, PassKeyFromPassword} from '../../../lib/CloudClient/CloudClient';

  export default {
    data(){
      return {
        email: null,
        password: null,
        error: null
      }
    },
    methods: {
      async load(){
        try{
          let passKey = PassKeyFromPassword(password)
          let cloudKey = await DeriveCloudKey(passKey)
          let body = await authenticate(email, cloudKey)
          setToken(body.jwt)
          let vaults = getVault()
        } catch (err) {
          this.error = err
        }
      }
    }
  }
</script>
