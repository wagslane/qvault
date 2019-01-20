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
    data(){
      return {
        qr_key: null,
        char_key: null,
        pass_key: null,
        door_key: null,
        master_key: null,
      }
    }
  }
</script>
