<template>
  <div>
    <TitleBar />
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
import routes from './routes.es6';
import storage from './mixins/storage.es6';
import TitleBar from './components/title_bar.vue';
import {heightMac, heightWin} from './consts/title_bar.es6';
import {type} from 'os';
import box_types from './consts/box_types.es6';

export const router = new VueRouter({routes});

export default {
  components: {
    TitleBar
  },
  mixins: [ storage ],
  data(){
    return {
      box_types,
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
