<template>
  <div>
    <TitleBar />
    <router-view />
  </div>
</template>

<script>
  import VueRouter from 'vue-router';
  import routes from './routes.es6';
  import storage from './mixins/storage.es6';
  import electron from 'electron';
  import TitleBar from './components/title_bar.vue';

  export const router = new VueRouter({routes});

  export default {
    router: router,
    components: {
      TitleBar
    },
    mixins: [ storage ],
  };
</script>

<style lang="less">
  @import './styles/styles.less';
  @import './styles/scrollbar.less';
  @import './styles/character_code.less';
</style>
