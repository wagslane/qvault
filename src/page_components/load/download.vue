<template>
  <div>
    <HeaderBar title="Load" />
    <div class="options-box">
      <form @submit.prevent="$refs.loader.load">
        <div class="body">
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
import { DeriveCloudKey, PassKeyFromPassword } from '../../lib/QVaultCrypto/QVaultCrypto';
import { authenticate, setToken } from '../../lib/CloudClient/CloudClient';

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
      try {
        let passKey = await PassKeyFromPassword(this.password);
        let cloudKey = await DeriveCloudKey(passKey);
        let body = await authenticate(this.email, cloudKey);
        setToken(body.jwt);
        this.$root.email = this.email;
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
