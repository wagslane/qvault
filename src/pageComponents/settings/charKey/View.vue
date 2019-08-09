<template>
  <div>
    <HeaderBar title="Settings" />
    <div class="options-box">
      <div class="body">
        <h1>Current Recovery Code</h1>
        <h2>
          This recovery code can be used to reset your password if you forget it.
        </h2>

        <div class="highlight-box">
          <span class="title">This is your current recovery code. Keep it in a safe place. </span>
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
        <h3> The code is case-sensitive, underlines are used for capital letters </h3>

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
  },
};
</script>
