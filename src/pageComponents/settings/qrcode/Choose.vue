<template>
  <div>
    <HeaderBar title="Settings" />
    <div class="options-box">
      <div class="body center-text">
        <h1>Manage Dual Encryption</h1>
        <h2>Dual encryption enhances the security of your vault</h2>

        <router-link
          class="btn"
          :to="{name: 'SettingsQrcodeAddOrChange'}"
        >
          <span v-if="($root.qr_required)">
            Change Key Code
          </span>
          <span v-else>
            Add Key Code
          </span>
        </router-link>

        <div
          v-if="($root.qr_required)"
          class="btn"
          @click="showDeleteDualEncryptionModal"
        >
          Turn off dual encryption
        </div>
        <br>
        <br>
        <span
          v-if="error"
          class="form-error"
        >{{ error }}</span>
      </div>
      <div class="footer">
        <div
          class="back"
          @click="$router.push({name: 'Settings'})"
        >
          <div class="icon" />
        </div>
      </div>
    </div>
    <confirm
      ref="deleteDualEncryptionModal"
      title="Remove Dual Encryption"
      subtitle="Are you sure? Scanning a QR code will no longer be required to access your vault."
    />
    <TimingOverlay
      ref="loader"
    />
    <TimingOverlay
      ref="successOverlay"
      overlay-screen="success"
      title="Vault Saved"
    />
  </div>
</template>

<script>
import TimingOverlay from '../../../components/TimingOverlay.vue';
import confirm from '../../../components/Confirm.vue';

export default {
  components:{
    TimingOverlay,
    confirm
  },
  data(){
    return {
      error: null
    };
  },
  methods:{
    async save(){
      const oldQrRequired = this.$root.qr_required;
      const oldQrKey = this.$root.qr_key;
      this.$root.qr_required = false;
      this.$root.qr_key = null;

      try{
        await this.$root.SaveBoth();
      } catch (err){
        this.$root.qr_required = oldQrRequired;
        this.$root.qr_key = oldQrKey;
        throw err;
      }
    },
    async deleteDualEncryption(){
      try{
        await this.$refs.loader.load(this.save);
      } catch (err){
        this.error = err;
        return;
      }
      await this.$refs.successOverlay.sleep(1200);
      this.$router.push({name: 'Settings'});
    },
    showDeleteDualEncryptionModal(){
      this.$refs.deleteDualEncryptionModal.show(this.deleteDualEncryption);
    },
  },
};
</script>
