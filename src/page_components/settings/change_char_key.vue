<template>
  <div>
    <HeaderBar title="Settings" />
    <div class="options-box">
      <div class="body">
        <h1>Add / Change Q Card Restore Code</h1>
        <h2>Write the new code on the back of both of your Q Cards</h2>

        <div class="highlight-box">
          <span class="title">If you don't want to change your code click the back arrow</span>
          <div class="flex">
            <div
              v-for="(word, i) in split"
              :key="i"
              class="character-code"
            >
              <span
                v-for="(char, j) in word"
                :key="j"
                class="spacing"
              >
                <u v-if="/[A-Z]/.test(char)">{{ char }}</u>
                <span v-else>{{ char }}</span>
              </span>
            </div>
          </div>
        </div>
        <span
          v-if="error"
          class="form-error"
        >{{ error }}</span>
        <br>
      </div>
      <div class="footer">
        <div
          class="back"
          @click="$router.go(-1)"
        >
          <div class="icon" />
        </div>
        <div
          v-if="$root.char_key"
          @click="click_continue"
        >
          <button class="continue">
            <span>Apply Change</span>
            <div class="continue-arrow" />
          </button>
        </div>
      </div>
    </div>
    <LoadingOverlay
      ref="loader"
      :func="generate_key"
    />
  </div>
</template>

<script>
import {GenerateCharKey, HashCharKey} from '../../lib/QVaultCrypto/QVaultCrypto';

export default {
  data(){
    return {
      char_key: null,
      hashed_char_key: null,
      error: null
    };
  },
  computed:{
    split(){
      if (!this.char_key){
        return [];
      }
      return [
        this.char_key.slice(0, 4),
        this.char_key.slice(4, 8),
        this.char_key.slice(8, 12),
        this.char_key.slice(12, 16)
      ];
    }
  },
  mounted(){
    this.$refs.loader.load();
  },
  methods:{
    async generate_key(){
      this.char_key = await GenerateCharKey();
      this.hashed_char_key = await HashCharKey(this.char_key);
    },
    async click_continue(){
      let old_char_key = this.$root.char_key;
      let old_hashed_char_key = this.$root.hashed_char_key;
      this.$root.char_key = this.char_key;
      this.$root.hashed_char_key = this.hashed_char_key;
      try{
        await this.$root.SaveBoth();
      } catch (err){
        this.error = err;
        this.$root.char_key = old_char_key;
        this.$root.hashed_char_key = old_hashed_char_key;
        return;
      }
      this.$router.push({name: 'settings'});
    }
  }
};
</script>
