<template>
  <div>
    <HeaderBar title="Setup" />
    <div class="options-box">
      <div class="body center-text">
        <StepProgress :filled="2" />
        <h1>Dual Encryption Code</h1>
        <h2>Take and save a picture of this QR Code</h2>
        <h3>
          Keep the code handy, it will be used each time you open your vault
        </h3>
        <h3>
          Backup several copies of the picture in different locations. If you lose 
          the code you will be unable to access your vault
        </h3>

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

        <router-link
          class="link"
          :to="{name: 'CreateStep3'}"
        >
          Or skip dual encrpytion
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
  </div>
</template>

<script>
import QrcodeViewer from '../../components/QrcodeViewer.vue';
import { GenerateQRKey } from '../../lib/QVaultCrypto/QVaultCrypto';

export default {
  components:{
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
    clickContinue(){
      this.$root.CreateQrKey(this.qrKey);
      this.$router.push({name: 'CreateStep3'});
    }
  }
};
</script>

<style lang="less" scoped>
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
</style>
