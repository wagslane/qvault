<template>
  <div>
    <HeaderBar title="Setup" />
    <div class="options-box">
      <div class="body">
        <StepProgress :filled="1" />
        <h1>Key Backup</h1>
        <h2>Do you have a Q Card you can use to backup your vault access?</h2>

        <router-link class="btn" :to="{name: 'create_step_3'}">
          Add Q Card
        </router-link>

        <router-link class="btn" :to="{name: 'create_step_5'}">
          Skip for now
        </router-link>
      </div>

      <div class="footer">
        <div class="back" @click="$router.go(-1)">
          <div class="icon" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    mounted(){
      this.$root.CreateCharKey();
    },
  }
</script>
