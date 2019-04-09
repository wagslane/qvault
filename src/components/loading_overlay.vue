<template>
  <div
    v-if="loading"
    class="screen"
  >
    <div class="center">
      <img src="../img/loading.gif">
    </div>
  </div>
</template>

<script>
export default {
  props: { 
    func: {
      type: Function,
      required: true
    }
  },
  data(){
    return {
      loading: false
    };
  },
  async updated(){
    if (this.loading){
      requestAnimationFrame(async () => {
        requestAnimationFrame(async () => {
          await this.func();
          this.loading = false;
        });
      });
    }
  },
  methods:{
    load(){
      this.loading = true;
    }
  }
};
</script>

<style lang="less" scoped>
  @import '../styles/colors.less';

  .screen {
    background: rgba(0,0,0,0.50);
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;

    .center{
      position: absolute;
      left: 50%;
      top: 50%;
      -webkit-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
      text-align: center;
    }
  }
</style>
