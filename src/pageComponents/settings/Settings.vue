<template>
  <div>
    <HeaderBar :title="'Settings v' +version" />
    <div class="options-box">
      <div class="body center-text">
        <h1>Settings</h1>
        <h2>Manage your vault and account</h2>

        <div
          v-if="$root.email"
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
          :to="{name: 'settingsChangePassword'}"
        >
          Change Password
        </router-link>

        <router-link
          class="btn"
          :to="{name: 'settingsCharKeyChoose'}"
        >
          Manage Recovery Card
        </router-link>

        <router-link
          class="btn"
          :to="{name: 'settingsQrcodeChoose'}"
        >
          Manage Key Card
        </router-link>

        <router-link
          v-if="!$root.email"
          class="btn"
          :to="{name: 'settingsCloudAccountLoginRegister'}"
        >
          Add Cloud Storage
        </router-link>

        <router-link
          v-else
          class="btn"
          :to="{name: 'settingsDeleteAccount'}"
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
</style>
