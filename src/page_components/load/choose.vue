<template>
  <div>
    <HeaderBar title="Open" />
    <div class="options-box">
      <h2>Open a local vault file, or download one from the cloud.</h2>
      <router-link
        class="btn"
        :to="{name: 'load_local'}"
      >
        Open Local Vault
      </router-link>
      <router-link
        class="btn"
        :to="{name: 'load_cloud_step_1'}"
      >
        Open Cloud Vault
      </router-link>
    </div>
  </div>
</template>
