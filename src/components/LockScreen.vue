<template>
  <div
    v-if="visible"
    class="screen"
    :style="{top: styleTop}"
  >
    <div class="center">
      <div class="options-box">
        <form @submit.prevent="unlock">
          <div class="body center-text">
            <h1>Vault Locked</h1>
            <h2>Please enter your password or passphrase</h2>
            <DecoratedTextInput
              v-model="password"
              :active="true"
              keyboard-id="password" 
              description="Password / Passphrase" 
              type="password" 
            />
            <span
              v-if="error"
              class="form-error"
            >{{ error }}</span>
          </div>
          <div class="footer">
            <button
              v-if="password"
              class="continue"
              type="submit"
            >
              <span>Continue</span>
              <div class="continue-arrow" />
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import {heightMac, heightWin} from '../consts/titleBar';

export default {
  data(){
    return {
      visible: false,
      password: '',
      error: null,
    };
  },
  computed:{
    isMac(){
      return window.nodeAPI.os.type() === 'Darwin';
    },
    styleTop(){
      if (this.isMac){
        return heightMac;
      }
      return heightWin;
    },
  },
  methods:{
    lock() {
      this.visible = true;
      this.password = '';
      this.error = '';
    },
    unlock(){
      if (this.$root.password === this.password){
        this.visible = false;
      } else{
        this.error = "Invalid Password";
      }
    }
  }
};
</script>

<style lang="less" scoped>
  @import '../styles/colors.less';
  @import '../styles/z_indices.less';
  
  .screen {
    background: #000000;
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    z-index: @zMax;

    .center{
      position: absolute;
      left: 50%;
      top: 50%;
      -webkit-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
      text-align: center;
    }
  }
</style>
