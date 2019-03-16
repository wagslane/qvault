<template>
  <div>
    <HeaderBar title="Setup" />
    <div class="options-box">
      <div class= "body">
        <StepProgress :filled="2" />
        <h1>Create a Q Card backup</h1>
        <h2>Backup your vault for safekeeping</h2>

        <div v-if="$root.char_key">
          <div class='highlight-box'>
            <h3>Write the following characters on your Q Card</h3>
            <div class="flex">
              <div v-for="word in split" class='character-code'>
                <span v-for="char in word" class="spacing">
                  <u v-if="/[A-Z]/.test(char)">{{char}}</u>
                  <span v-else>{{ char }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div v-else>
          <h2>Generating backup key, please wait...</h2>
        </div>
      </div>

      <br />
      <br />
      <div class="footer">
        <div class="back" @click="$router.go(-1)">
          <div class="icon" />
        </div>
        <router-link v-if="$root.char_key" :to="{name: 'create_step_4'}">
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
        ]
      }
    }
  }
</script>

<style lang="less" scoped>
.highlight-box {
  margin: auto;
  padding: 20px;
  width: 75%;
  height: 166px;
  border: 1px solid rgba(255,255,255,0.5);
  border-radius: 5px;	
  background-color: #333739;
  box-shadow: 0 2px 14px 0 rgba(0,0,0,0.1);
  padding-top: 24px;
}

.flex {
  display: flex;
}

.character-code {
  flex-grow: 1;
  margin: 10px;
  height: 54px;
  line-height: 54px;
  border-radius: 5px;	
  background-color: #1A1D1F;
  color: rgba(255,255,255,0.7);
  font-size: 14px;
  text-align: center;
  padding-left: 6px;
  padding-right: 6px;
}

.spacing {
  margin-left: 3px;
  margin-right: 3px;
}
</style>
