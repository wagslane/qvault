<template>
  <div class="options-box">
    <h1 class="get-started">Get Started</h1>
    <h2>Create a new vault, or open one you've created before.</h2>

    <router-link tag='span' :to="{name: 'create_step_1'}">
      <button
        class="btn"
      >Create New Vault</button>
    </router-link>

    <router-link tag='span' :to="{name: 'load'}">
      <button
        class="btn"
      >Open Existing Vault</button>
    </router-link>
  </div>
</template>

