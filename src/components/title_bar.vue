<template>
  <div
    v-if="is_mac"
    class="title-bar"
    :style="{height: `${heightMac}px`}"
  />
  <div
    v-else
    class="title-bar win"
    :style="{height: `${heightWin}px`}"
  >
    <button
      class="title-btn close"
      @click="close"
    >
      <svg><polygon points="10.2,0.7 9.5,0 5.1,4.4 0.7,0 0,0.7 4.4,5.1 0,9.5 0.7,10.2 5.1,5.8 9.5,10.2 10.2,9.5 5.8,5.1" /></svg>
    </button>
    <button
      class="title-btn"
      @click="max"
    >
      <svg><path d="M0,0v10h10V0H0z M9,9H1V1h8V9z" /></svg>
    </button>
    <button
      class="title-btn"
      @click="min"
    >
      <svg><rect
        x="0"
        y="50%"
        width="10.2"
        height="1"
      /></svg>
    </button>
  </div>
</template>

<script>
import {remote} from 'electron';
import {type} from 'os';
import {heightMac, heightWin} from '../consts/title_bar';

export default {
  computed:{
    is_mac(){
      return type() === 'Darwin';
    },
    heightMac(){
      return heightMac;
    },
    heightWin(){
      return heightWin;
    }
  },
  methods:{
    min(){
      const window = remote.getCurrentWindow();
      window.minimize(); 
    },
    max(){
      const window = remote.getCurrentWindow();
      if (!window.isMaximized()) {
        window.maximize();
      } else {
        window.unmaximize();
      }
    },
    close(){
      const window = remote.getCurrentWindow();
      window.close();
    }
  }
};
</script>

<style lang="less" scoped>
  @import '../styles/colors.less';

  .title-bar{
    -webkit-app-region: drag;
    width: 100%;
    background-color: @black-light;
    padding: 0px;
    margin: 0px;
  }

  .win {
    .title-btn{
      -webkit-app-region: no-drag;
      margin: 0;
      width: 48px;
      height: 32px;
      border: 0;
      border-radius: 0;
      outline: 0;
      padding: 0;
      background: transparent;
      float: right;

      &:hover{
        background: @gray-blue;
      }

      svg polygon {
        fill: white;
      }
      
      svg {
        width: 10px;
        height: 10px;
      }
    }

    .close{
      &:hover{
        background: @red-pink !important;
      }
    }
  }
</style>
