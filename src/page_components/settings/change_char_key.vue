<template>
  <div>
    <HeaderBar title="Settings" />
    <div class="options-box">
      <div class= "body">
        <h1>Get a new backup code</h1>
        <h2>Add or change your Q Card code</h2>

        <div class='highlight-box'>
          <h3>Write the following characters on your Q Card</h3>
          <div class="flex">
            <div v-for="(word, i) in split" :key="i" class='character-code'>
              <span v-for="(char, j) in word" :key="j" class="spacing">
                <u v-if="/[A-Z]/.test(char)">{{char}}</u>
                <span v-else>{{ char }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="back" @click="$router.go(-1)">
          <div class="icon" />
        </div>
        <div v-if="$root.char_key" @click="click_continue">
          <button class="continue">
            <span>Continue</span>
            <div class="continue-arrow" />
          </button>
        </div>
      </div>
    </div>
    <LoadingOverlay title="Creating New Code" :func="generate_key" ref="loader" />
  </div>
</template>

<script>
  import {GenerateCharKey, HashCharKey} from '../../lib/QVaultCrypto/QVaultCrypto'

  export default {
    data(){
      return {
        char_key: null,
        hashed_char_key: null
      }
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
      click_continue(){
        this.$root.char_key = this.char_key;
        this.$root.hashed_char_key = this.hashed_char_key;
        alert('code changed successfully');
        this.$router.push({name: 'settings'});
      }
    }
  }
</script>
