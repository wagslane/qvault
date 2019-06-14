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
          v-if="!success"
          @scanned="handleQRKey"
        />
        <div
          v-else
          class="checkmark"
          v-html="checkmark_filled_svg"
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
  </div>
</template>

<script>
import {ValidateQRKey} from '../../../lib/QVaultCrypto/QVaultCrypto';
import QRScanner from '../../../components/qrcode_scanner.vue';
import checkmark_filled_svg from '../../../img/checkmark-filled.svg';

export default {
  components:{
    QRScanner,
  },
  data(){
    return {
      error: null,
      success: false
    };
  },
  computed:{
    checkmark_filled_svg(){
      return checkmark_filled_svg;
    }
  },
  methods:{
    async handleQRKey(qrKey) {
      if (qrKey.substring(0, 6) === 'ERROR:'){
        this.error = "Couldn't find a camera on this device";
        return;
      }
      if (!ValidateQRKey(qrKey)){
        this.error = `Not a valid QR key`;
        return;
      }

      let old_qr_required = this.$root.qr_required;
      let old_qr_key = this.$root.qr_key;
      this.$root.qr_required = true;
      this.$root.qr_key = qrKey;
      try{
        await this.$root.SaveBoth();
      } catch (err){
        this.error = err;
        this.$root.qr_required = old_qr_required;
        this.$root.qr_key = old_qr_key;
        return;
      }
      this.success = true;
      setTimeout(() => { this.$router.push({name: 'settings'}); }, 1500);
    },
  }
};
</script>

<style lang="less" scoped>

.body{
  text-align: center;
}

.checkmark{
  margin: 0 auto;
  width: 28px;
}
</style>
