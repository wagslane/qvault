<template>
  <div>
    <HeaderBar title="Settings" />
    <div class="options-box">
      <div class="body">
        <h1>Delete your cloud account</h1>
        <h2 v-if="!deleted">
          Are you sure? Account deletion is permanent
        </h2>

        <div
          v-if="!deleted"
          class="btn"
          @click="load"
        >
          Yes, delete my account
        </div>
        <div
          v-else
          class="checkmark"
          v-html="checkmark_filled_svg"
        />
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
import checkmark_filled_svg from '../../img/checkmark-filled.svg';
import {deleteUser, isLoggedIn, deleteToken} from '../../lib/CloudClient/CloudClient';

export default {
  data(){
    return {
      deleted: false,
      error: null
    };
  },
  computed:{
    checkmark_filled_svg(){
      return checkmark_filled_svg;
    }
  },
  methods:{
    async load(){
      this.$refs.loader.load();
    },
    async delete_account(){
      this.error = null;
      try{
        if (!isLoggedIn()){
          await this.$root.Login(this.$root.email, this.$root.password);
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
      this.$root.email = '';
      await this.$root.SaveLocalVault();
      this.deleted = true;
      setTimeout(() => { this.$router.push({name: 'settings'}); }, 1200);
    }
  },
};
</script>

<style lang="less" scoped>
.checkmark{
  margin: 0 auto;
  width: 28px;
}
</style>
