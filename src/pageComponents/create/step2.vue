<template>
  <div>
    <HeaderBar title="Setup" />
    <div class="options-box">
      <div class="body">
        <StepProgress :filled="2" />
        <h1>Qvault Recovery Card</h1>
        <h2>
          This recovery code is the ONLY WAY to restore access to your vault if you forget your password/passphrase
        </h2>
        <div class="highlight-box">
          <span class="title">Write this code on the back of of your recovery card, and keep it in a safe place </span>
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
      </div>

      <br>
      <br>
      <div class="footer">
        <div
          class="back"
          @click="$router.go(-1)"
        >
          <div class="icon" />
        </div>
        <router-link
          v-if="$root.char_key"
          :to="{name: 'createStep3'}"
        >
          <button class="continue">
            <span>Continue</span>
            <div class="continue-arrow" />
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed:{
    split(){
      return [
        this.$root.char_key.slice(0, 4),
        this.$root.char_key.slice(4, 8),
        this.$root.char_key.slice(8, 12),
        this.$root.char_key.slice(12, 16)
      ];
    }
  }
};
</script>
