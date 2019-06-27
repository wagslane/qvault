<template>
  <div>
    <HeaderBar title="Settings" />
    <div class="options-box">
      <div class="body">
        <h1>Add/Change Qvault Recovery Card</h1>
        <h2>
          This recovery code is the ONLY WAY to restore access to your vault if you forget your password/passphrase.
        </h2>

        <div class="highlight-box">
          <span class="title">Write this code on the back of of your recovery card, and keep it in a safe place. </span>
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
        <h3> The code is case-sensitive, use underlines for capital letters </h3>

        <br>
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
    <timingOverlay
      ref="loader"
    />
    <timingOverlay
      ref="successOverlay"
      overlay-screen="success"
    />
  </div>
</template>

<script>
import {GenerateCharKey, HashCharKey} from '../../lib/QVaultCrypto/QVaultCrypto';
import timingOverlay from '../../components/timing_overlay.vue';

export default {
  components:{
    timingOverlay
  },
  data(){
    return {
      char_key: null,
      hashed_char_key: null
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
    this.$refs.loader.load(this.generate_key);
  },
  methods:{
    async generate_key(){
      this.char_key = await GenerateCharKey();
      this.hashed_char_key = await HashCharKey(this.char_key);
    },
    async click_continue(){
      this.$root.char_key = this.char_key;
      this.$root.hashed_char_key = this.hashed_char_key;
      await this.$refs.successOverlay.sleep(1200);
      this.$router.push({name: 'settings'});
    }
  }
};
</script>
