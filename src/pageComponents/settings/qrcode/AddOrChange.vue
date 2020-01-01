<template>
  <div>
    <HeaderBar title="Settings" />
    <div class="options-box">
      <div class="body">
        <h1 v-if="($root.qr_required)">
          Change Dual Encryption Code
        </h1>
        <h1 v-else>
          Add Dual Encryption Code
        </h1>
        <h2>Manage your dual encryption QR code</h2>

        <div class="qrWrapper">
          <QrcodeViewer
            v-if="qrKey"
            :value="qrKey"
            class="qrcode"
          />
          <div class="qrText">
            {{ qrKey }}
          </div>
        </div>
      </div>
      <div class="footer">
        <div
          class="back"
          @click="$router.go(-1)"
        >
          <div class="icon" />
        </div>
        <button
          v-if="qrKey"
          class="continue"
          @click="clickContinue"
        >
          <span>Continue</span>
          <div class="continue-arrow" />
        </button>
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
import TimingOverlay from '../../../components/TimingOverlay.vue';
import QrcodeViewer from '../../../components/QrcodeViewer.vue';
import { GenerateQRKey } from '../../../lib/QVaultCrypto/QVaultCrypto';

export default {
  components:{
    TimingOverlay,
    QrcodeViewer,
  },
  data(){
    return {
      qrKey: null
    };
  },
  mounted(){
    this.qrKey = GenerateQRKey();
  },
  methods: {
    async clickContinue(){
      this.$root.CreateQrKey(this.qrKey);
      await this.$refs.successOverlay.sleep(1200);
      this.$router.push({name: 'Settings'});
    }
  }
};
</script>

<style lang="less" scoped>
.body{
  text-align: center;

  .qrWrapper{
    text-align: center;
    margin-top: 15px;
    margin-bottom: 15px;
    overflow-wrap: break-word;
    color: #fff;

    .qrText{
      margin-top: 10px;
    }
  }

}
</style>
