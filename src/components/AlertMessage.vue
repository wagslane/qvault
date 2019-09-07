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
          <QrcodeViewer
            v-if="qrValue"
            :value="qrValue"
            class="qrcode"
          />
          <p>{{ content }}</p>
          <div
            class="btn"
            @click="hide"
          >
            Done
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QrcodeViewer from './QrcodeViewer.vue';

export default {
  components:{
    QrcodeViewer,
  },
  props: { 
    title:{
      type: String,
      required: false,
      default: ''
    },
    subtitle:{
      type: String,
      required: false,
      default: ''
    },
    content:{
      type: String,
      required: false,
      default: ''
    },
    qrValue:{
      type: String,
      required: false,
      default: null
    }
  },
  data(){
    return {
      visible: false,
      onConfirm: () => {},
    };
  },
  methods:{
    async hide() {
      this.visible = false;
    },
    show(){
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

      .body{
        overflow-wrap: break-word;

        .qrcode{
          margin-top: 5px;
          margin-bottom: 5px;
        }

        p{
          margin-top: 5px;
          margin-bottom: 5px;
        }
      }
    }
  }
</style>
