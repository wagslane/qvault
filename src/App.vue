<template>
  <div>
    <TitleBar />
    <LockScreen ref="lockScreen" />
    <div 
      id="body-contents"
      :style="{height: `calc(100vh - ${titleHeight}px)`}"
    >
      <router-view />
    </div>
  </div>
</template>

<script>
import VueRouter from 'vue-router';
import routes from './routes';
import storage from './mixins/storage';
import TitleBar from './components/TitleBar.vue';
import {heightMac, heightWin} from './consts/titleBar';
import LockScreen from './components/LockScreen.vue';
import { store } from './store/store';
import {preferenceFileExists, createPreferenceFile} from './lib/appPreferences';

export const router = new VueRouter({routes});

export default {
  components: {
    TitleBar,
    LockScreen,
  },
  store,
  mixins: [ storage ],
  data(){
    return {
      updateReady: false
    };
  },
  computed:{
    titleHeight(){
      if (window.nodeAPI.os.type() === 'Darwin'){
        return heightMac;
      }
      return heightWin;
    }
  },
  mounted(){
    window.nodeAPI.electron.ipcRenderer.on('systemIdle', () => {
      // We are using this.password as a check to know if we have a vault
      // unlocked. Hopefully that assumption remains sound
      if (this.password){
        this.$refs.lockScreen.lock();
      }
    });
    window.nodeAPI.electron.ipcRenderer.on('updateReady', () => {
      this.updateReady = true;
    });
    if (!preferenceFileExists()){
      createPreferenceFile();
    }
  },
  router
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
