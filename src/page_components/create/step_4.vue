<template>
  <div>
    <HeaderBar title="Setup" />
    <div class="options-box">
      <div class="body center-text">
        <StepProgress :filled="3" />
        <h1>Qvault Key Card</h1>
        <h2>Scan the QR code on your key card to dual encrypt your vault</h2>
        <h3>
          Keep your key card handy, it will be scanned each time you unlock your vault.
        </h3>

        <QRScanner @scanned="handleQRKey" />
        <span
          v-if="error"
          class="form-error"
        >{{ error }}</span>
        <br>
        <br>

        <router-link
          class="link"
          :to="{name: 'create_step_5'}"
        >
          Skip for now
        </router-link>
        <br>
        <br>
      </div>
      <div class="footer">
        <div
          class="back"
          @click="$router.go(-1)"
        >
          <div class="icon" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {ValidateQRKey} from '../../lib/QVaultCrypto/QVaultCrypto';
import QRScanner from '../../components/qrcode_scanner.vue';

export default {
  components:{
    QRScanner,
  },
  data(){
    return {
      error: null
    };
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
      this.$router.push({name: 'create_step_5'});
    },
  }
};
</script>
