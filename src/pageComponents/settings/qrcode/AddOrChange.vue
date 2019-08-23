<template>
  <div>
    <HeaderBar title="Settings" />
    <div class="options-box">
      <div class="body">
        <h1 v-if="($root.qr_required)">
          Change Dual Encryption Card
        </h1>
        <h1 v-else>
          Add Dual Encryption Card
        </h1>
        <h2>Manage your card's dual encryption QR code</h2>

        <QRScanner
          @scanned="handleQRKey"
        />
        <br>
        <br>
        <span
          v-if="error"
          class="form-error"
        >{{ error }}</span>
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
    <TimingOverlay
      ref="loader"
    />
    <TimingOverlay
      ref="successOverlay"
      title="Vault Saved"
      overlay-screen="success"
    />
  </div>
</template>

<script>
import {ValidateQRKey} from '../../../lib/QVaultCrypto/QVaultCrypto';
import QRScanner from '../../../components/QrcodeScanner.vue';
import TimingOverlay from '../../../components/TimingOverlay.vue';

export default {
  components:{
    QRScanner,
    TimingOverlay,
  },
  data(){
    return {
      error: null
    };
  },
  methods:{
    async change(qrKey){
      if (qrKey.substring(0, 6) === 'ERROR:'){
        throw "Couldn't find a camera on this device";
      }
      if (!ValidateQRKey(qrKey)){
        throw `Not a valid QR key`;
      }

      const oldQrRequired = this.$root.qr_required;
      const oldQrKey = this.$root.qr_key;
      this.$root.qr_required = true;
      this.$root.qr_key = qrKey;
      try{
        await this.$root.SaveBoth();
      } catch (err){
        this.$root.qr_required = oldQrRequired;
        this.$root.qr_key = oldQrKey;
        throw err;
      }
    },
    async handleQRKey(qrKey) {
      try {
        await this.$refs.loader.load(async () => await this.change(qrKey));
      } catch (err){
        this.error = err;
        return;
      }
      await this.$refs.successOverlay.sleep(1200);
      this.$router.push({name: 'Settings'});
    },
  }
};
</script>

<style lang="less" scoped>
.body{
  text-align: center;
}
</style>
