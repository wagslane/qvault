<template>
  <div>
    <HeaderBar title="Setup" />
    <div class="options-box">
      <div class="body">
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

      <div class="footer">
        <div class="back" @click="$router.go(-1)" />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    mounted(){
      this.$root.GenerateCharKey();
    },
  }
</script>
