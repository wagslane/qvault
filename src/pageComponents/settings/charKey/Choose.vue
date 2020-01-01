<template>
  <div>
    <HeaderBar title="Settings" />
    <div class="options-box">
      <div class="body center-text">
        <h1>Manage Recovery Code</h1>
        <h2>View or change the recovery code for your vault</h2>

        <div
          class="btn"
          @click="showViewRecoveryCodeModal"
        >
          View Recovery Code
        </div>

        <router-link
          class="btn"
          :to="{name: 'SettingsCharKeyChange'}"
        >
          Change Recovery Code
        </router-link>
      </div>
      <div class="footer">
        <div
          class="back"
          @click="$router.push({name: 'Settings'})"
        >
          <div class="icon" />
        </div>
      </div>
    </div>
    <confirm
      ref="viewRecoveryCodeModal"
      title="View Recovery Code"
      subtitle="Are you sure you want to see your recovery code? Make sure no one is around to see it."
    />
  </div>
</template>

<script>
import confirm from '../../../components/Confirm.vue';

export default {
  components:{
    confirm
  },
  methods:{
    viewRecoveryCode(){
      this.$router.push({name: 'SettingsCharKeyView'});
    },
    showViewRecoveryCodeModal(){
      this.$refs.viewRecoveryCodeModal.show(this.viewRecoveryCode);
    },
  },
};
</script>
