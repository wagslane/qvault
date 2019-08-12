<template>
  <div
    v-if="visible"
    class="screen"
  >
    <div class="center">
      <h1 class="title">
        {{ title }}
      </h1>

      <img
        v-if="overlayScreen === 'loading' "
        src="../img/q-vault-loader.gif"
      >
      <checkmarkSvg
        v-else-if="overlayScreen === 'success' "
        :height="200"
        :width="200"
        fill="#D8A22E"
      />
    </div>
  </div>
</template>

<script>
import sleep from '../lib/sleep';
import checkmarkSvg from '../img/checkmark.svg.vue';

export default {
  components:{
    checkmarkSvg
  },
  props: { 
    overlayScreen:{
      type: String,
      default: 'loading',
      required: false,
    },
    title:{
      type: String,
      default: null,
      required: false,
    }
  },
  data(){
    return {
      visible: false
    };
  },
  methods:{
    async nextFrame() {
      return new Promise(resolve => {
        requestAnimationFrame(resolve);
      });
    },
    async load(f){
      this.visible = true;
      await this.nextFrame();
      await this.nextFrame();
      try{
        const returnVal = await f();
        this.visible = false;
        return returnVal;
      } catch (err){
        this.visible = false;
        throw err;
      }
    },
    async sleep(millis){
      this.visible = true;
      await this.nextFrame();
      await this.nextFrame();
      await sleep(millis);
      this.visible = false;
    }
  }
};
</script>

<style lang="less" scoped>
  @import '../styles/colors.less';
  @import '../styles/z_indices.less';

  .title {
    color: @gold-mid;
    font-size: 42px;
  }

  .screen {
    background: rgba(0,0,0,0.70);
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: @zTimingOverlay;

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
