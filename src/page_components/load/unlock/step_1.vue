<template>
  <div>
    <HeaderBar title="Load" />
    <div class="options-box">
      <form @submit.prevent="$refs.loader.load">
        <div class="body center-text">
          <h1>Unlock Vault</h1>
          <div v-if="!scanQr">
            <h2>Please enter your password or passphrase</h2>
            <TextInput
              v-model="password"
              :active="true"
              keyboard-id="password" 
              description="Password / Passphrase" 
              type="password" 
            />
            <span
              v-if="error"
              class="form-error"
            >{{ error }}</span>
            <br>
            <span
              v-if="showDownload"
              class="link"
              @click="toDownload"
            >Back and Download
            </span>
            <br v-if="showDownload">
            <br v-if="showDownload">
            <router-link
              class="link"
              :to="{name: 'load_unlock_step_2'}"
            >
              Forgot password?
            </router-link>
          </div>
          <div v-if="scanQr">
            <h2>Please scan your Q Card</h2>
            <QRScanner @scanned="handleQRKey" />
          </div>
          <br>
          <div
            v-if="updateReady"
            class="link"
            @click="$refs.loader_update.load"
          >
            Quit and install latest version
          </div>
        </div>
        <div class="footer">
          <div
            class="back"
            @click="back"
          >
            <div class="icon" />
          </div>
          <button
            v-if="(password && !scanQr)"
            class="continue"
            type="submit"
          >
            <span>Continue</span>
            <div class="continue-arrow" />
          </button>
        </div>
      </form>
    </div>
    <LoadingOverlay
      ref="loader"
      :func="unlock"
    />
    <LoadingOverlay
      ref="loader_update"
      :func="updateVersion"
    />
  </div>
</template>

<script>
import { ValidateQRKey, DeriveCloudKey } from '../../../lib/QVaultCrypto/QVaultCrypto';
import QRScanner from '../../../components/qrcode_scanner.vue';
import { authenticate, setToken, getVault } from '../../../lib/CloudClient/CloudClient';
import {ipcRenderer} from 'electron';
const sleep = require('util').promisify(setTimeout);

export default {
  components:{
    QRScanner,
  },
  data(){
    return {
      error: null,
      password: null,
      scanQr: false,
      updateReady: false,
      allowOverwrite: false,
      showDownload: false,
      originalLoadedVault: this.$root.loaded_vault,
    };
  },
  mounted(){
    this.scanQr = this.$root.qr_required;
    ipcRenderer.on('updateReady', ()=>{
      this.updateReady = true;
    });
  },
  methods: {
    async updateVersion(){
      ipcRenderer.send('downloadUpdate');
      await sleep(20000);
      alert("Error downloading update");
    },
    toDownload(){
      this.$root.ResetStorageState();
      this.$router.push({name: 'load_download'});
    },
    async unlock(){
      this.error = null;
      try{
        await this.$root.UnlockVaultPassword(this.password);
      } catch(err){
        this.error = err;
        return;
      }
      if (this.$root.email){
        try{
          let cloud_key = await DeriveCloudKey(this.$root.pass_key);
          let body = await authenticate(this.$root.email, cloud_key);
          setToken(body.jwt);
        } catch(err){
          this.error = err;
          return;
        }
        if (this.allowOverwrite){
          this.$router.push({name: 'vault'});
          return;
        }
        try{
          this.$root.loaded_vault = await getVault();
        } catch(err){
          this.error = err;
          this.error += ". Click 'continue' to overwrite";
          this.$root.loaded_vault = this.originalLoadedVault;
          this.allowOverwrite = true;
          return;
        }
        try{
          await this.$root.UnlockVaultPassword(this.password);
        } catch(err){
          this.error = "Unable to unlock cloud vault. Click 'continue' to overwrite your cloud vault, or 'Back and Download' to use it";
          this.$root.loaded_vault = this.originalLoadedVault;
          this.allowOverwrite = true;
          this.showDownload = true;
          return;
        }
      }
      this.$router.push({name: 'vault'});
    },
    async handleQRKey(qrKey) {
      if (qrKey.substring(0, 6) === 'ERROR:'){
        this.error = qrKey;
        return;
      }
      if (!ValidateQRKey(qrKey)){
        this.error = `Not a valid QR key`;
        return;
      }
      this.$root.CreateQrKey(qrKey);
      await this.$root.UnlockVaultQr(qrKey);
      this.scanQr = false;
      this.error = '';
    },
    back(){
      try{
        this.$root.ClearLastUsedVaultCache();
      } catch (err) {
        // we don't care that much
      }
        
      // Clear all the loaded data
      this.$root.loaded_vault = null;
      this.$root.local_vault_path = null;
      this.$root.email = null;
      this.$root.qr_required = false;
   
      this.$router.go(-1);
    }
  }
};
</script>
