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
          <ProgressBar
            :bytes="$root.encrypted_vault_size"
          />
          <br>
          <br>
        </div>
        <h3 v-else>
          Offline - No cloud account connected to this vault
        </h3>

        <router-link
          v-if="(!$root.email)"
          class="btn"
          :to="{name: 'settings_signup'}"
        >
          Add a cloud storage account
        </router-link>

        <router-link
          class="btn"
          :to="{name: 'settings_change_password'}"
        >
          Change password
        </router-link>

        <router-link
          class="btn"
          :to="{name: 'settings_change_char_key'}"
        >
          Add or change Q Card restore code
        </router-link>

        <router-link
          class="btn"
          :to="{name: 'settings_qrcode_choose'}"
        >
          Manage two factor encryption
        </router-link>

        <router-link
          v-if="($root.email)"
          class="btn"
          :to="{name: 'settings_delete_account'}"
        >
          Delete cloud storage account
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
