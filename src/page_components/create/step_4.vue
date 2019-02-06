<template>
  <div>
    <HeaderBar title="Setup" />
    <div class="options-box">
      <StepProgress :filled="4" />
      <h1>Scan your QR Code</h1>
      <h2>Use 2nd factor encryption with your QR Code</h2>
      <p>Key: {{qrKey}}</p>
      <p>Error: {{error}}</p>
      <QRScanner @scanned="handleQRKey"  />
    </div>
  </div>
</template>

<script>
  import {ValidateQRKey} from '../../lib/QVaultCrypto/QVaultCrypto';
  import QRScanner from '../../components/qrcode_scanner.vue'

  export default {
    data(){
      return {
        qrKey: '',
        error: ''
      }
    },

    methods:{
      save_step_2(){
        this.$router.push({name: 'create_step_5'});
      },
      handleQRKey: function(qrKey) {
        if (!ValidateQRKey(qrKey)){
          this.error = `Error scanning qrKey: ${qrKey}`
          return
        }
        this.qrKey = qrKey;
      },
    },
    components:{
      QRScanner,
    }
  }
</script>
