<template>
  <div
    v-if="visible"
    class="screen"
  >
    <div class="center">
      <div class="options-box">
        <div class="body">
          <h1>{{ title }}</h1>
          <h2>{{ subtitle }}</h2>

          <div
            class="btn"
            @click="confirm"
          >
            Confirm
          </div>

          <div
            class="link"
            @click="done"
          >
            Cancel
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: { 
    title:{
      type: String,
      required: true,
    },
    subtitle:{
      type: String,
      required: false,
      default: ''
    }
  },
  data(){
    return {
      visible: false,
      onConfirm: () => {},
    };
  },
  methods:{
    async confirm() {
      await this.onConfirm();
      this.done();
    },
    done(){
      this.onConfirm = () => {};
      this.visible = false;
    },
    show(f){
      this.onConfirm = f;
      this.visible = true;
    }
  }
};
</script>

<style lang="less" scoped>
  @import '../styles/colors.less';
  @import '../styles/z_indices.less';

  .screen {
    background: rgba(0,0,0,0.50);
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: @zConfirmModal;

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
