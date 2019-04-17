<template>
  <div>
    <TitleBar />
    <div 
      id="body-contents"
      :style="{height: `calc(100vh - ${titleHeight}px)`}"
    >
      <div v-if="updateReady">
        <h1>A new update is ready to install!</h1>
        <router-view v-else />
      </div>
    </div>
</div></template>

<script>
import VueRouter from 'vue-router';
import routes from './routes.es6';
import storage from './mixins/storage.es6';
import TitleBar from './components/title_bar.vue';
import {heightMac, heightWin} from './consts/title_bar.es6';
import {type} from 'os';
import {ipcRenderer} from 'electron';

export const router = new VueRouter({routes});

export default {
  components: {
    TitleBar
  },
  mixins: [ storage ],
  data(){
    return{
      updateReady: false,

    };
  },
  router: router,
  computed:{
    titleHeight(){
      if (type() === 'Darwin'){
        return heightMac;
      }
      return heightWin;
    }
  },
  mounted(){
    ipcRenderer.on('updateReady', ()=>{
      this.updateReady = true;
    });
  }
};
</script>

<style lang="less">
  @import './styles/styles.less';
  @import './styles/scrollbar.less';
  @import './styles/character_code.less';

  #body-contents{
    overflow-y: auto;
  }
</style>
