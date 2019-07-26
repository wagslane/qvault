<template>
  <div>
    <HeaderBar title="Load" />
    <div class="options-box">
      <form @submit.prevent="$refs.loader.load(unlock)">
        <div class="body center-text">
          <h1>Unlock Vault</h1>
          <div v-if="!qrRequired">
            <h2>Please enter your password or passphrase</h2>
            <h3 class="gold-mid">
              {{ vaultFileName }}
            </h3>
            <DecoratedTextInput
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
            >Back and Download</span>
            <br v-if="showDownload">
            <br v-if="showDownload">
            <router-link
              class="link"
              :to="{name: 'load_unlock_step_2'}"
            >
              Forgot password?
            </router-link>
          </div>
          <div v-else>
            <h2>Please scan your key card</h2>
            <span
              v-if="error"
              class="form-error"
            >{{ error }}</span>
            <QRScanner @scanned="handleQRKey" />
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
            v-if="(password && !qrRequired)"
            class="continue"
            type="submit"
          >
            <span>Continue</span>
            <div class="continue-arrow" />
          </button>
        </div>
      </form>
    </div>
    <timingOverlay
      ref="loader"
    />
  </div>
</template>

<script>
import { ValidateQRKey } from '../../../lib/QVaultCrypto/QVaultCrypto';
import QRScanner from '../../../components/qrcodeScanner.vue';
import timingOverlay from '../../../components/timingOverlay.vue';
import {ClearLastUsedVault} from '../../../lib/LastUsedVaultPath';

export default {
  components:{
    QRScanner,
    timingOverlay,
  },
  data(){
    return {
      error: null,
      password: null,
      qrRequired: false,
      qrKey: null,
      allowOverwrite: false,
      showDownload: false,
      originalLoadedVault: this.$root.loaded_vault,
      vaultFileName: ''
    };
  },
  mounted(){
    this.vaultFileName = this.$root.local_vault_path.split('\\').pop().split('/').pop();
    this.qrRequired = this.$root.qr_required;
  },
  methods: {
    toDownload(){
      this.$root.ResetStorageState();
      this.$router.push({name: 'load_download'});
    },
    async unlock(){
      this.error = null;
      try{
        await this.$root.UnlockVaultPassword(this.password, this.$root.loaded_vault.salt);
      } catch(err){
        this.error = `Unable to unlock vault: ${err}`;
        return;
      }

      if (this.$root.email){
        try{
          await this.$root.Login(this.$root.email, this.$root.password);
        } catch(err){
          this.error = `Unable to access cloud account: ${err}`;
          return;
        }

        if (this.allowOverwrite){
          this.$router.push({name: 'vault'});
          return;
        }

        try{
          await this.$root.DownloadVault();
        } catch(err){
          this.error = err;
          this.error += ". Click 'continue' to overwrite";
          this.$root.loaded_vault = this.originalLoadedVault;
          this.allowOverwrite = true;
          return;
        }

        // if the cloud vault also has a qr requirement
        if (this.$root.qr_required){
          // try to open it with the same qr code if we have one
          if (this.qrKey){
            try{
              await this.$root.UnlockVaultQr(this.qrKey);
            } catch (err) {
              this.qrKey = null;
              this.error = "QR code doesn't match, use the QR code that was used to lock the cloud vault";
              return;
            }
          } else {
            // Otherwise require a scan
            this.qrRequired = true;
            return;
          }
        }

        try{
          await this.$root.UnlockVaultPassword(this.password, this.$root.loaded_vault.salt);
        } catch(err){
          this.error = "Unable to unlock cloud vault. Continue to overwrite your cloud vault, or go back and download it separately";
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
      try{
        await this.$root.UnlockVaultQr(qrKey);
      } catch (err) {
        this.error = err;
        return;
      }
      this.$root.CreateQrKey(qrKey);
      this.qrRequired = false;
      this.error = '';
      this.qrKey = qrKey;
    },
    back(){
      try{
        ClearLastUsedVault();
      } catch (err) {
        // we don't care that much
      }
      
      this.$root.ResetStorageState();
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="less" scoped>
  @import '../../../styles/colors.less';
  .gold-mid{
    color: @gold-mid
  }
</style>
