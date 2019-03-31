<template>
  <div>
    <HeaderBar title="Settings" />
    <div class="options-box">
      <div class="body">
        <h1>Delete you cloud account</h1>
        <h2>Are you sure? Account deletion is permanent</h2>

        <div
          class="btn"
          @click="load"
        >
          Yes, delete my account
        </div>
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
    <LoadingOverlay
      ref="loader"
      :func="delete_account"
    />
  </div>
</template>

<script>
import {deleteUser, authenticate, isLoggedIn, setToken, deleteToken} from '../../lib/CloudClient/CloudClient';
import {DeriveCloudKey} from '../../lib/QVaultCrypto/QVaultCrypto';

export default {
  data(){
    return {
      error: null
    };
  },
  methods:{
    async load(){
      this.$refs.loader.load();
    },
    async delete_account(){
      try{
        if (!isLoggedIn()){
          let cloudKey = await DeriveCloudKey(this.pass_key);
          let body = await authenticate(this.email, cloudKey);
          setToken(body.jwt);
        }
      } catch (err){
        this.error = err;
        return;
      }

      try{
        await deleteUser();
      } catch (err){
        this.error = err;
        return;
      }

      deleteToken();
      alert("Account deleted successfully");
      this.$root.email = '';
      await this.$root.SaveLocalVault();
      this.$router.push({name: 'settings'});
    }
  },
};
</script>
