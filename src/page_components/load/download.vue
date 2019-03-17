<template>
  <div>
    <HeaderBar title="Load" />
    <div class="options-box">
      <form @submit.prevent="$refs.loader.load">
        <div class="body">
          <h1>Load From Cloud</h1>
          <h2>Download your vault from the Q Vault servers</h2>
          <TextInput
            v-model="email"
            :active="true"
            keyboardID="email" 
            description="email" 
            type="email"/>
          <TextInput
            v-model="password" 
            keyboardID="password" 
            description="password" 
            type="password"/>
          <span class="form-error" >{{error}}</span>
        </div>
        <div class="footer">
          <div class="back" @click="$router.go(-1)">
            <div class="icon" />
          </div>
          <button
              type="submit"
              class="continue"
            >
            <span>Download</span>
            <div class="continue-arrow" />
          </button>
        </div>
      </form>
    </div>
    <LoadingOverlay title="Downloading" :func="download" ref="loader" />
  </div>
</template>

<script>
  import { DeriveCloudKey, PassKeyFromPassword } from '../../lib/QVaultCrypto/QVaultCrypto';
  import { authenticate, setToken, getVault } from '../../lib/CloudClient/CloudClient';

  export default {
    data(){
      return {
        email: null,
        password: null,
        error: null
      }
    },
    methods: {
      async download(){
        try{
          let passKey = await PassKeyFromPassword(this.password);
          let cloudKey = await DeriveCloudKey(passKey);
          let body = await authenticate(this.email, cloudKey);
          setToken(body.jwt);
          this.$root.email = this.email;
          this.$root.loaded_vault = await getVault();
          this.unlock();
        } catch (err) {
          this.error = err;
        }
      },
      async unlock(){
        requestAnimationFrame(async () => {
          requestAnimationFrame(async () => {
            try{
              this.$root.NewVaultDialog();
              this.$root.SaveVault(this.$root.loaded_vault);
              this.$router.push({name: 'load_unlock_step_1'});
            } catch (err) {
              this.error = err;
            }
          })
        })
      }
    }
  }
</script>
