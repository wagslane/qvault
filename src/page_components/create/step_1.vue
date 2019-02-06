<template>
  <div>
    <HeaderBar title="Setup" />
    <div class="options-box">
      <StepProgress :filled="1" />
      <h1>Get Started</h1>
      <h2>Create a new vault, or open one you've created before.</h2>

      <router-link class="btn" :to="{name: 'create_step_2'}">
        Create New Vault
      </router-link>

      <router-link class="btn" :to="{name: 'load'}">
        Open Existing Vault
      </router-link>
    </div>
  </div>
</template>

<script>
  import StepProgress from '../../components/step_progress.vue'
  import HeaderBar from '../../components/header_bar.vue'

  export default {
    components:{
      StepProgress,
      HeaderBar
    }
  }
</script>
