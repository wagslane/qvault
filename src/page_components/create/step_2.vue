<template>
  <div class="options-box">
    <StepProgress :filled="2" />
    <h1>Key Backup</h1>
    <h2>Create a new vault, or open one you've created before.</h2>

    <router-link class="btn" :to="{name: 'create_step_3'}">
      Add Qvault Card
    </router-link>

    <router-link class="btn" :to="{name: 'create_step_5'}">
      Create Without Backup
    </router-link>
  </div>
</template>

<script>
  import StepProgress from '../../components/step_progress.vue'

  export default {
    mounted(){
      this.$root.GenerateCharKey();
    },
    components:{
      StepProgress
    }
  }
</script>
