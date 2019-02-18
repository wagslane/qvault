<template>
  <div>
    <HeaderBar title="Load" />
    <div class="options-box">
      <div class="body">
        <h1>Unlock Vault</h1>
        <form v-if="!qrRequired" @submit.prevent="unlock">
          <TextInput
            v-model="password"
            :active="true"
            keyboardID="password" 
            description="password" 
            type="password"/>
          <p>{{error}}</p>
          <button
            class="btn"
            type="submit"
          >Unlock</button>
        </form>
        <QRScanner v-if="qrRequired" @scanned="handleQRKey"  />
      </div>
    </div>
  </div>
</template>

<script>
  import { ValidateQRKey } from '../../lib/QVaultCrypto/QVaultCrypto';
  import QRScanner from '../../components/qrcode_scanner.vue'

  export default {
    data(){
      return {
        error: null,
        password: null,
        qrRequired: false
      }
    },
    methods: {
      async unlock(){
        if (this.$root.loaded_vault.qr_required){
          this.qrRequired = true
          return
        }
        try{
          await this.$root.UnlockVaultPassword(this.password)
          this.$router.push({name: 'vault'});
        } catch (err) {
          this.error = err;
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
        await this.$root.UnlockVaultQr(qrKey)
        await this.$root.UnlockVaultPassword(this.password)
        this.$router.push({name: 'vault'});
      }
    },
  }
</script>
