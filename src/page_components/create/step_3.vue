<template>
  <form>
    <h1>Create the vault key</h1>
    <input type="password" v-model="passphrase" required />
  </form>
</template>

<script>
  export default {
    data(){
      return {
        passphrase: null,
      }
    }
  }
</script>
