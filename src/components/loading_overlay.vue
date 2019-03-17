<template>
  <div class="screen" v-if="loading" />
</template>

<script>
  export default {
    data(){
      return {
        loading: false
      }
    },
    props: { 
      func: {
        type: Function,
        required: true
      }
    },
    async updated(){
      if (this.loading){
        requestAnimationFrame(async () => {
          requestAnimationFrame(async () => {
            await this.func();
            this.loading = false;
          })
        })
      }
    },
    methods:{
      load(){
        this.loading = true;
      }
    }
  }
</script>

<style lang="less" scoped>
  .screen {
    background: rgba(0,0,0,0.2) url("../img/loading.gif") center center no-repeat;
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
  }
</style>
