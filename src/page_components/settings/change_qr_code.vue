<template>
  <div>
    <HeaderBar title="Settings" />
    <div class="options-box">
      <div class= "body">
        <h1>Add a new 2FE QR Code</h1>
        <h2>Add or change your Q Card QR Code</h2>

        <QRScanner @scanned="handleQRKey"  />
        <span class="form-error" v-if="error">{{error}}</span>
        <br />
        <br />
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
  import {ValidateQRKey} from '../../lib/QVaultCrypto/QVaultCrypto';
  import QRScanner from '../../components/qrcode_scanner.vue'

  export default {
    data(){
      return {
        error: null
      }
    },
    methods:{
      handleQRKey: function(qrKey) {
        if (qrKey.substring(0, 6) === 'ERROR:'){
          this.error = "Couldn't find a camera on this device";
          return;
        }
        if (!ValidateQRKey(qrKey)){
          this.error = `Not a valid QR key`;
          return;
        }
        this.$root.CreateQrKey(qrKey);
        alert('QR Key changed successfully');
        this.$router.push({name: 'settings'});
      },
    },
    components:{
      QRScanner,
    }
  }
</script>
