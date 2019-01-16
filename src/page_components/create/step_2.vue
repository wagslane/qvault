<template>
  <form>
    <h1>Enter the 12 words on your Q-Card</h1>
    <input type="password" v-model="key" required />
    <h2>Write the following characters on your Q-Card:</h2>
    <h3>{{suffix}}</h3>
  </form>
</template>

<script>
  export default {
    data(){
      return {
        key: null,
        suffix: null,
      }
    },
  }
</script>
