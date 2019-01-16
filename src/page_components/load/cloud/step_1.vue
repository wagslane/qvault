<template>
  <form>
    <h1>Load From Cloud</h1>
    <input type="email" v-model="email" required />
    <input type="password" v-model="passphrase" required />
    <button type="submit">Log in</button>
  </form>
</template>

<script>
  export default {
    data(){
      return {
        email: null,
        passphrase: null,
      }
    }
  }
</script>
