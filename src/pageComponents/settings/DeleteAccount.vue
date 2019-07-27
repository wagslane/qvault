<template>
  <div>
    <HeaderBar title="Settings" />
    <div class="options-box">
      <div class="body">
        <h1>Delete your cloud account</h1>
        <h2>
          Are you sure? Account deletion is permanent
        </h2>

        <div
          class="btn"
          @click="load"
        >
          Yes, delete my account
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
          @click="$router.go(-1)"
        >
          <div class="icon" />
        </div>
      </div>
    </div>
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
import {deleteUser, isLoggedIn, deleteToken} from '../../lib/CloudClient/CloudClient';
import TimingOverlay from '../../components/TimingOverlay.vue';

export default {
  components:{
    TimingOverlay
  },
  data(){
    return {
      error: null
    };
  },
  methods:{
    async load(){
      try{
        await this.$refs.loader.load(this.DeleteAccount);
      } catch (err){
        this.error = err;
        return;
      }
      await this.$refs.successOverlay.sleep(1200);
      this.$router.push({name: 'settings'});
    },
    async DeleteAccount(){
      this.error = null;
      if (!isLoggedIn()){
        await this.$root.Login(this.$root.email, this.$root.password);
      }
      await deleteUser();
      deleteToken();
      this.$root.email = '';
      await this.$root.SaveLocalVault();
    }
  },
};
</script>
