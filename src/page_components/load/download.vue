<template>
  <div>
    <HeaderBar title="Load" />
    <div class="options-box">
      <form @submit.prevent="$refs.loader.load">
        <div class="body center-text">
          <h1>Load From Cloud</h1>
          <h2>Download your vault from the Qvault servers</h2>
          <DecoratedTextInput
            v-model="email"
            :active="true"
            keyboard-id="email" 
            description="email" 
            type="email"
          />
          <DecoratedTextInput
            v-model="password" 
            keyboard-id="password" 
            description="password" 
            type="password"
          />
          <span
            v-if="error"
            class="form-error"
          >{{ error }}</span>
          <br>
          <br>
          <router-link
            class="link"
            :to="{
              name: 'utility_reset_cloud_password', 
              params: {donePath: 'load_download'}
            }"
          >
            Trouble accessing cloud account?
          </router-link>
        </div>
        <div class="footer">
          <div
            class="back"
            @click="$router.go(-1)"
          >
            <div class="icon" />
          </div>
          <button
            type="submit"
            class="continue"
          >
            <span>Download</span>
            <div class="continue-arrow" />
          </button>
        </div>
      </form>
    </div>
    <LoadingOverlay
      ref="loader"
      :func="download"
    />
  </div>
</template>

<script>
export default {
  data(){
    return {
      email: null,
      password: null,
      error: null
    };
  },
  methods: {
    async download(){
      try{
        await this.$root.Login(this.email, this.password);
      } catch (err) {
        this.error = `Unable to access cloud account: ${err}`;
        this.$root.loaded_vault = null;
        return;
      }
      try {
        await this.$root.DownloadVault();
        this.unlock();
      } catch (err) {
        this.error = err;
        this.$root.loaded_vault = null;
      }
    },
    async unlock(){
      requestAnimationFrame(async () => {
        requestAnimationFrame(async () => {
          try{
            this.$root.NewVaultDialog();
            this.$root.SaveVault(this.$root.loaded_vault);
            this.$router.push({name: 'load_unlock_step_1'});
          } catch (err) {
            this.error = err;
          }
        });
      });
    }
  }
};
</script>
