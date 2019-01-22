<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
  import VueRouter from 'vue-router';

  import routes from './routes.es6';

  export const router = new VueRouter({routes});

  export default {
    router: router,
    mixins: [storage_api],
  }
</script>
