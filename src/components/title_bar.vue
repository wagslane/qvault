<template>
  <div v-if="is_mac" class="title-bar mac" />
  <div v-else class="title-bar win">
    <button @click="close" class="title-btn close">
      <svg><polygon points="10.2,0.7 9.5,0 5.1,4.4 0.7,0 0,0.7 4.4,5.1 0,9.5 0.7,10.2 5.1,5.8 9.5,10.2 10.2,9.5 5.8,5.1" /></svg>
    </button>
    <button @click="max" class="title-btn">
      <svg><path d="M0,0v10h10V0H0z M9,9H1V1h8V9z" /></svg>
    </button>
    <button @click="min" class="title-btn">
      <svg><rect x="0" y="50%" width="10.2" height="1" /></svg>
    </button>
  </div>
</template>

<script>
  import {remote} from 'electron';
  import {type} from 'os';

  export default {
    computed:{
      is_mac(){
        return type() === 'Darwin';
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
  }
</script>

<style lang="less" scoped>
  .title-bar{
    -webkit-app-region: drag;
    width: 100%;
    background-color: #2F3235;
    padding: 0px;
    margin: 0px;
  }

  .mac {
    height: 22px; 
  }

  .win {
    height: 32px; 

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
        background: #7E8A95;
      }

      svg polygon {
        fill: #fff;
      }
      
      svg {
        width: 10px;
        height: 10px;
      }
    }

    .close{
      &:hover{
        background: #e81123 !important;
      }
    }
  }
</style>
