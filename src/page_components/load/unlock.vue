<template>
  <form @submit.prevent="unlock">
    <HeaderBar title="Load" />
    <div class="options-box">
      <div class="body">
        <h1>Unlock Vault</h1>
        <TextInput
          v-model="password" 
          keyboardID="password" 
          description="Password" 
          type="password"/>
        <p>{{error}}</p>
        <button
          type="submit"
          v-if="password"
          class="btn"
        >Unlock</button>
      </div>
    </div>
  </form>
</template>

<script>
  export default {
    data(){
      return {
        error: null,
        password: null,
      }
    },
    methods: {
      async unlock(){
        try{
          await this.$root.UnlockVault(this.password)
          this.$router.push({name: 'vault'});
        } catch (err) {
          this.error = err;
        }
      },

    },
  }
</script>
