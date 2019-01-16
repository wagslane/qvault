<template>
  <form>
    <h1>Unlock Vault</h1>
    <input type="password" v-model="passphrase" required />
    <button type="submit">Log in</button>
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
