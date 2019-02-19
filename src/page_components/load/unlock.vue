<template>
  <div>
    <HeaderBar title="Load" />
    <div class="options-box">
      <div class="body">
        <h1>Unlock Vault</h1>
        <form v-if="!qrRequired" @submit.prevent="unlock">
          <h2>Please enter your password or passphrase</h2>
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
        <div v-if="qrRequired">
          <h2>Please scan your Q Card</h2>
          <QRScanner @scanned="handleQRKey" />
        </div>
      </div>
      <div class="footer">
        <div class="back" @click="$router.go(-1)">
          <div class="icon" />
        </div>
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
    mounted: function(){
      if (this.$root.loaded_vault.qr_required){
        this.qrRequired = true
      }
    },
    methods: {
      async unlock(){
        try{
          await this.$root.UnlockVaultPassword(this.password)
          this.$router.push({name: 'vault'});
        } catch (err) {
          this.error = err;
        }
      },
      async handleQRKey(qrKey) {
        if (qrKey.substring(0, 6) === 'ERROR:'){
          this.error = qrKey;
          return
        }
        if (!ValidateQRKey(qrKey)){
          this.error = `Not a valid QR key`;
          return
        }
        this.$root.CreateQrKey(qrKey);
        await this.$root.UnlockVaultQr(qrKey);
        this.qrRequired = false;
        this.error = '';
      }
    },
    components:{
      QRScanner,
    }
  }
</script>
