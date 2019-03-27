<template>
  <div>
    <HeaderBar title="Load" />
    <div class="options-box">
      <div class="body center-text">
        <h1>Load a Vault</h1>
        <h2>Open a local vault file if you have one on this device, or download one from the cloud.</h2>

        <div
          class="btn"
          @click.prevent="open"
        >
          Open Local Vault
        </div>

        <router-link
          class="link"
          :to="{name: 'load_download'}"
        >
          Lost vault file? Download from cloud
        </router-link>

        <span class="form-error">{{ error }}</span>
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
        error: null,
      };
    },
    methods: {
      async open(){
        try{
          this.$root.ExistingVaultDialog();
          this.$router.push({name: 'load_unlock_step_1'});
        } catch (err) {
          this.error = err;
        }
      },

    },
  };
</script>
