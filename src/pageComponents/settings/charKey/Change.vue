<template>
  <div>
    <HeaderBar title="Settings" />
    <div class="options-box">
      <div class="body">
        <h1>Add/Change Qvault Recovery Code</h1>
        <h2>
          This recovery code is the ONLY WAY to restore access to your vault if you forget your password/passphrase.
        </h2>

        <div class="highlight-box">
          <span class="title">Write this code in a safe place. </span>
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
          @click="clickContinue"
        >
          <button class="continue">
            <span>Apply Change</span>
            <div class="continue-arrow" />
          </button>
        </div>
      </div>
    </div>
    <TimingOverlay
      ref="loader"
    />
    <TimingOverlay
      ref="successOverlay"
      overlay-screen="success"
      title="Vault Saved"
    />
  </div>
</template>

<script>
import {GenerateCharKey} from '../../../lib/QVaultCrypto/QVaultCrypto';
import TimingOverlay from '../../../components/TimingOverlay.vue';

export default {
  components:{
    TimingOverlay
  },
  data(){
    return {
      charKey: null
    };
  },
  computed:{
    split(){
      if (!this.charKey){
        return [];
      }
      return [
        this.charKey.slice(0, 4),
        this.charKey.slice(4, 8),
        this.charKey.slice(8, 12),
        this.charKey.slice(12, 16)
      ];
    }
  },
  mounted(){
    this.charKey = GenerateCharKey();
  },
  methods:{
    async save(){
      const oldCharKey = this.$root.char_key;
      this.$root.char_key = this.charKey;
      try{
        await this.$root.SaveBoth();
      } catch (err){
        this.$root.char_key = oldCharKey;
        throw err;
      }
    },
    async clickContinue(){
      try{
        await this.$refs.loader.load(this.save);
      } catch (err){
        alert(err);
        return;
      }
      await this.$refs.successOverlay.sleep(1200);
      this.$router.push({name: 'Settings'});
    }
  }
};
</script>
