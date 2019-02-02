<template>
  <div class="modal">
    <div class="content">
      <h1 class="get-started">Get Started</h1>
      <h2>Create a new vault, or open one you've created before.</h2>
      <button
        @click.prevent="next = 'create_step_1'"
        class="btn"
        :class="{'btn-selected': next == 'create_step_1'}"
      >Create New Vault</button>
      <button
        @click.prevent="next = 'load'"
        class="btn"
        :class="{'btn-selected': next == 'load'}"
      >Open Existing Vault</button>
    </div>
    <div class="bottom">
      <router-link :to="{name: next}">Continue</router-link>
    </div>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        next: 'create_step_1',
      }
    }
  }
</script>
