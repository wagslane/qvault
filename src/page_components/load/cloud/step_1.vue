<template>
  <div>
    <HeaderBar title="Load" />
    <div class="options-box">
      <div class="body">
        <h1>Load From Cloud</h1>
        <h2>Download your vault from the Q Vault servers</h2>
        <form v-if="!qrRequired" @submit.prevent="load">
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
          <button
            class="btn"
            type="submit"
          >Download</button>
        </form>
        <QRScanner v-if="qrRequired" @scanned="handleQRKey"  />
      </div>
      <div class="footer">
        <div class="back" @click="$router.go(-1)" />
        <button
          class="continue"
        >
        <span>Continue</span>
        <div class="continue-arrow" />
      </button>
      </div>
    </div>
  </div>
</template>

<script>
  import { DeriveCloudKey, PassKeyFromPassword } from '../../../lib/QVaultCrypto/QVaultCrypto';
  import { authenticate, setToken, getVault } from '../../../lib/CloudClient/CloudClient';
  import { ValidateQRKey } from '../../../lib/QVaultCrypto/QVaultCrypto';
  import QRScanner from '../../../components/qrcode_scanner.vue'

  export default {
    data(){
      return {
        email: null,
        password: null,
        error: null,
        qrRequired: false
      }
    },
    methods: {
      async load(){
        try{
          let passKey = await PassKeyFromPassword(this.password)
          let cloudKey = await DeriveCloudKey(passKey)
          let body = await authenticate(this.email, cloudKey)
          setToken(body.jwt)
          let vaults = getVault()
          if (vaults.length < 1){
            this.error = "Your account has no vaults to download"
            return
          }
          this.$root.loaded_vault = vaults[0];
          if (this.$root.loaded_vault.qr_required){
            this.qrRequired = true
            return
          }
          await this.$root.UnlockVault(this.password, null)
          this.$router.push({name: 'vault'});
        } catch (err) {
          this.error = err
        }
      },
      async handleQRKey(qrKey) {
        if (qrKey.substring(0, 6) === 'ERROR:'){
          this.error = qrKey
          return
        }
        if (!ValidateQRKey(qrKey)){
          this.error = `Not a valid QR key`
          return
        }
        this.$root.CreateQrKey(qrKey);
        await this.$root.UnlockVault(this.password, qrKey)
        this.$router.push({name: 'vault'});
      }
    }
  }
</script>
