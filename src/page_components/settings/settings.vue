<template>
  <div>
    <HeaderBar :title="'Settings v' +version" />
    <div class="options-box">
      <div class="body center-text">
        <h1>Settings</h1>
        <h2>Manage your vault and account</h2>

        <div
          v-if="($root.email)"
        > 
          <h3 class="gold-mid">
            {{ $root.email }}
          </h3>
          <ProgressBar
            :bytes="$root.encrypted_vault_size"
          />
          <br>
          <br>
        </div>
        <h3 v-else>
          Offline - No Cloud Account
        </h3>

        <router-link
          class="btn"
          :to="{name: 'settings_change_password'}"
        >
          Change Password
        </router-link>

        <router-link
          class="btn"
          :to="{name: 'settings_change_char_key'}"
        >
          Manage Recovery Card
        </router-link>

        <router-link
          class="btn"
          :to="{name: 'settings_qrcode_choose'}"
        >
          Manage Dual Encryption Card
        </router-link>

        <router-link
          v-if="(!$root.email)"
          class="btn"
          :to="{name: 'settings_signup'}"
        >
          Add Cloud Storage
        </router-link>

        <router-link
          v-else
          class="btn"
          :to="{name: 'settings_delete_account'}"
        >
          Delete Cloud Storage
        </router-link>
      </div>
      <div class="footer">
        <div
          class="back"
          @click="$router.push({name: 'vault'})"
        >
          <div class="icon" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProgressBar from '../../components/progress_bar.vue';
const pjson = require('../../../package.json');

export default {
  components:{
    ProgressBar
  },
  data(){
    return{
      version: pjson.version
    };
  }
};
</script>

<style lang="less" scoped>
  @import '../../styles/colors.less';
  .gold-mid{
    color: @gold-mid
  }
</style>
