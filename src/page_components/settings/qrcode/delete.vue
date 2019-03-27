<template>
  <div>
    <HeaderBar title="Settings" />
    <div class="options-box">
      <div class="body">
        <h1>Remove 2FE</h1>
        <h2>Are you sure? Scanning a QR code will no longer be required to access your vault.</h2>

        <div
          class="btn"
          @click="delete_2fe"
        >
          Yes, remove 2FE
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
  </div>
</template>

<script>
  export default {
    data(){
      return {
        error: null
      };
    },
    methods:{
      async delete_2fe(){
        let old_qr_required = this.$root.qr_required;
        let old_qr_key = this.$root.qr_key;
        this.$root.qr_required = false;
        this.$root.qr_key = null;

        try{
          await this.$root.SaveLocalVault();
          await this.$root.SaveCloudVaultIfEmail();
        } catch (err){
          this.$root.qr_required = old_qr_required;
          this.$root.qr_key = old_qr_key;
          return;
        }

        alert("2FE removed successfully");
        this.$router.push({name: 'settings'});
      }
    },
  };
</script>
