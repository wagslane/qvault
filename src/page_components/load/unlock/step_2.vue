<template>
  <div>
    <HeaderBar title="Load" />
    <div class="options-box">
      <form @submit.prevent="unlock">
        <div class="body">
          <h1>Restore Vault Access</h1>
          <h2>Please enter the code on the back of your Q Card</h2>
          <TextInput
            v-model="char_key"
            :active="true"
            keyboardID="char_key" 
            description="Code" 
            type="char_key"/>
          <span class="form-error" >{{error}}</span>
        </div>
        <div class="footer">
          <div class="back" @click="$router.go(-1)">
            <div class="icon" />
          </div>
          <button
            class="continue"
            type="submit"
            v-if="(char_key && !error)"
          >
            <span>Continue</span>
            <div class="continue-arrow" />
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        error: null,
        char_key: null
      }
    },
    methods: {
      async unlock(){
        try{
          await this.$root.UnlockVaultCharKey(this.char_key);
          this.$router.push({name: 'load_unlock_step_3'});
        } catch (err) {
          this.error = err;
        }
      }
    }
  }
</script>
