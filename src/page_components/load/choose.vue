<template>
  <div>
    <HeaderBar title="Load" />
    <div class="options-box">
      <div class="body">
        <h1>Load a Vault</h1>
        <h2>Open a local vault file, or download one from the cloud.</h2>

        <span class="form-error" >{{error}}</span>

        <div
          @click.prevent="open"
          class="btn"
        >
          Open Local Vault
        </div>

        <router-link class="btn" :to="{name: 'load_cloud_step_1'}">
          Download Cloud Vault
        </router-link>
      </div>
      <div class="footer">
        <div class="back" @click="$router.go(-1)">
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
      }
    },
    methods: {
      async open(){
        try{
          this.$root.ExistingVaultDialog()
          this.$router.push({name: 'load_unlock'});
        } catch (err) {
          this.error = err;
        }
      },

    },
  }
</script>
