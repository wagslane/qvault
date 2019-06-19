<template>
  <div>
    <HeaderBar title="Load" />
    <div class="options-box">
      <form @submit.prevent="$refs.loader.load">
        <div class="body">
          <h1>Recover Vault with Qvault Card</h1>
          <h2>Please enter the code from the back of your recovery card</h2>
          <DecoratedTextInput
            v-model="char_key"
            :active="true"
            keyboard-id="char_key" 
            description="Code (no spaces)" 
            type="char_key" 
          />
          <span
            v-if="error"
            class="form-error"
          >{{ error }}</span>
        </div>
        <div class="footer">
          <div
            class="back"
            @click="$router.go(-1)"
          >
            <div class="icon" />
          </div>
          <button
            v-if="(char_key && !error)"
            class="continue"
            type="submit"
          >
            <span>Continue</span>
            <div class="continue-arrow" />
          </button>
        </div>
      </form>
    </div>
    <LoadingOverlay
      ref="loader"
      :func="unlock"
    />
  </div>
</template>

<script>
export default {
  data(){
    return {
      error: null,
      char_key: null
    };
  },
  methods: {
    async unlock(){
      this.error = null;
      try{
        await this.$root.UnlockVaultCharKey(this.char_key);
        this.$router.push({name: 'load_unlock_step_3'});
      } catch (err) {
        this.error = "Invalid Code";
      }
    }
  }
};
</script>
