<template>
  <div class="options-box">
    <h1>Get Started</h1>
    <h2>Create a new vault, or open one you've created before.</h2>

    <router-link class="btn" :to="{name: 'create_step_1'}">
      Create New Vault
    </router-link>

    <router-link class="btn" :to="{name: 'load'}">
      Open Existing Vault
    </router-link>
  </div>
</template>
