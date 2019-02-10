<template>
  <div>
    <HeaderBar title="Setup" />
    <div class="options-box">
      <div class="body">
        <StepProgress :filled="4" />
        <h1>Second Factor Encryption</h1>
        <h2 v-if="!show">Would you like to require that your QR code is scanned each time you open your vault?</h2>

        <div v-if="!show" class="btn" @click="show = true">
          Yes
        </div>

        <router-link v-if="!show" class="btn" :to="{name: 'create_step_5'}">
          Skip for now
        </router-link>

        <p v-if="error">{{error}}</p>

        <QRScanner v-if="show" @scanned="handleQRKey"  />
      </div>
      <div class="footer">
        <div class="back" @click="$router.go(-1)" />
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
        error: null,
        show: false
      }
    },

    methods:{
      handleQRKey: function(qrKey) {
        if (!ValidateQRKey(qrKey)){
          this.error = `Not a valid Q Card key`
          return
        }
        this.$root.CreateQrKey(qrKey);
        this.$router.push({name: 'create_step_5'});
      },
    },
    components:{
      QRScanner,
    }
  }
</script>
