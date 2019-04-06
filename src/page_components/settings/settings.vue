<template>
  <div>
    <HeaderBar title="Settings" />
    <div class="options-box">
      <div class="body center-text">
        <h1>Settings</h1>
        <h2>Manage your vault and account</h2>

        <ProgressBar :bytes="$root.encrypted_vault_size" />
        <br>
        <br>

        <router-link
          v-if="(!$root.email)"
          class="btn"
          :to="{name: 'settings_signup'}"
        >
          Sign up for Q Vault storage account
        </router-link>

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
          Manage Backup Key
        </router-link>

        <router-link
          class="btn"
          :to="{name: 'settings_qrcode_choose'}"
        >
          Manage Two Factor Encryption
        </router-link>

        <router-link
          v-if="($root.email)"
          class="btn"
          :to="{name: 'settings_delete_account'}"
        >
          Delete Cloud Storage Account
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

export default {
  components:{
    ProgressBar
  }
};
</script>
