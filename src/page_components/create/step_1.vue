<template>
  <div class="options-box">
    <h1>Key Backup</h1>
    <h2>Create a new vault, or open one you've created before.</h2>

    <router-link tag='span' :to="{name: 'create_step_2'}">
      <button
        class="btn"
      >Add Qvault Card</button>
    </router-link>

    <router-link tag='span' :to="{name: 'create_step_3'}">
      <button
        class="btn"
      >Create Without Backup</button>
    </router-link>
  </div>
</template>
