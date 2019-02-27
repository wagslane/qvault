<template>
  <div>
    <HeaderBar title="Load" />
    <div class="options-box">
      <form v-if="!qrRequired" @submit.prevent="unlock">
        <div class="body center-text">
          <h1>Unlock Vault</h1>
          <h2>Please enter your password or passphrase</h2>
          <TextInput
            v-model="password"
            :active="true"
            keyboardID="password" 
            description="password" 
            type="password"/>
          <span class="form-error" >{{error}}</span>
          <br />
          <router-link class="link" :to="{name: 'load_unlock_step_2'}">
            Forgot password?
          </router-link>
          <div v-if="qrRequired">
            <h2>Please scan your Q Card</h2>
            <QRScanner @scanned="handleQRKey" />
          </div>
        </div>
        <div class="footer">
          <div class="back" @click="$router.go(-1)">
            <div class="icon" />
          </div>
          <button
            class="continue"
            type="submit"
            v-if="(password && !qrRequired)"
          >
            <span>Continue</span>
            <div class="continue-arrow" />
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import { ValidateQRKey, DeriveCloudKey, PassKeyFromPassword  } from '../../../lib/QVaultCrypto/QVaultCrypto';
  import QRScanner from '../../../components/qrcode_scanner.vue'
  import { authenticate, setToken, getVault } from '../../../lib/CloudClient/CloudClient';

  export default {
    data(){
      return {
        error: null,
        password: null,
        qrRequired: false
      }
    },
    mounted(){
      if (this.$root.loaded_vault.qr_required){
        this.qrRequired = true
      }
    },
    methods: {
      async unlock(){
        try{
          await this.$root.UnlockVaultPassword(this.password);
        } catch(err){
          this.error = err;
          return
        }
        if (this.$root.email){
          try{
            let cloud_key = await DeriveCloudKey(this.$root.pass_key);
            let body = await authenticate(this.$root.email, cloud_key);
            setToken(body.jwt);
            this.$root.loaded_vault = await getVault();
          } catch(err){
            this.error = err;
            return
          }
          try{
            await this.$root.UnlockVaultPassword(this.password);
          } catch(err){
            this.error = "Unable to unlock cloud vault";
            return
          }
        }
        this.$router.push({name: 'vault'});
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
