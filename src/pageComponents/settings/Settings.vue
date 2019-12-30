<template>
  <div>
    <HeaderBar :title="'Settings v' +version" />
    <div class="options-box">
      <div class="body center-text">
        <h1>Settings</h1>
        <h2>Manage your vault and account</h2>

        <h3
          v-if="!$store.getters.isAppOnline"
          class="red-pink"
        >
          Offline Mode
        </h3>
        <div
          v-else-if="$root.email"
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
          No Cloud Account
        </h3>

        <router-link
          class="btn"
          :to="{name: 'SettingsChangePassword'}"
        >
          Change Password
        </router-link>

        <router-link
          class="btn"
          :to="{name: 'SettingsCharKeyChoose'}"
        >
          Manage Recovery Code
        </router-link>

        <router-link
          class="btn"
          :to="{name: 'SettingsQrcodeChoose'}"
        >
          Manage Key Code
        </router-link>

        <router-link
          v-if="!$root.email && $store.getters.isAppOnline"
          class="btn"
          :to="{name: 'SettingsCloudAccountLoginRegister'}"
        >
          Add Cloud Storage
        </router-link>

        <router-link
          v-else-if="$store.getters.isAppOnline"
          class="btn"
          :to="{name: 'SettingsCloudAccountDeleteAccount'}"
        >
          Delete Cloud Storage
        </router-link>
      </div>
      <div class="footer">
        <div
          class="back"
          @click="$router.push({name: 'Vault'})"
        >
          <div class="icon" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProgressBar from '../../components/ProgressBar.vue';
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
  .red-pink{
    color: @red-pink
  }
</style>
