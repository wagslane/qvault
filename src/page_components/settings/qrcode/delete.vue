<template>
  <div>
    <HeaderBar title="Settings" />
    <div class="options-box">
      <div class="body">
        <h1>Remove Dual Encryption</h1>
        <h2>Are you sure? Scanning a QR code will no longer be required to access your vault.</h2>

        <div
          class="btn"
          @click="deleteDualEncryption"
        >
          Yes, remove dual encryption
        </div>

        <span
          v-if="error"
          class="form-error"
        >{{ error }}</span>
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
    <timingOverlay
      ref="successOverlay"
      overlay-screen="success"
      title="Vault Saved"
    />
  </div>
</template>

<script>
import timingOverlay from '../../../components/timing_overlay.vue';

export default {
  components:{
    timingOverlay
  },
  data(){
    return {
      error: null
    };
  },
  methods:{
    async deleteDualEncryption(){
      const oldQrRequired = this.$root.qr_required;
      const oldQrKey = this.$root.qr_key;
      this.$root.qr_required = false;
      this.$root.qr_key = null;

      try{
        await this.$root.SaveBoth();
      } catch (err){
        this.$root.qr_required = oldQrRequired;
        this.$root.qr_key = oldQrKey;
        return;
      }
      await this.$refs.successOverlay.sleep(1200);
      this.$router.push({name: 'settings'});
    }
  },
};
</script>
