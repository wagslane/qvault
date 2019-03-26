<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
  import VueRouter from 'vue-router';
  import routes from './routes.es6';
  import storage from './mixins/storage.es6';
  import { Titlebar, Color } from '@inceldes/cet';
  import electron from 'electron';

  new Titlebar({
    backgroundColor: Color.fromHex('#2F3235'),
    menu: null
  });

  export const router = new VueRouter({routes});

  export default {
    router: router,
    mixins: [storage],
  }
</script>

<style lang="less">
  @import './styles/styles.less';
  @import './styles/scrollbar.less';
  @import './styles/character_code.less';
</style>
