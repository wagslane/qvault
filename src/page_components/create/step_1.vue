<template>
  <div class="options-box">
    <h1>Key Backup</h1>
    <h2>Create a new vault, or open one you've created before.</h2>

    <router-link class="btn" :to="{name: 'create_step_2'}">
      Add Qvault Card
    </router-link>

    <router-link class="btn" :to="{name: 'create_step_3'}">
      Create Without Backup
    </router-link>
  </div>
</template>
