<template>
  <div class="header-bar">
    <div class="box">
      <img 
        class="img float-left"
        :style="{marginLeft: '20px'}"
        height="25" 
        width="25" 
        src="../img/qvault-logo.png"
      >
      <div class="online-switch float-left">
        <OnlineSwitch />
      </div>
    </div>

    <div class="box title">
      <span>{{ title }}</span>
    </div>

    <div class="box">
      <gearSvg
        v-if="settingsButton"
        class="img float-right pointer"
        height="25"
        width="25"
        @click.native="$router.push({name: 'Settings'})"
      />
      <div v-if="saveButton">
        <saveSvg
          v-if="!saved"
          class="img float-right pointer"
          height="25"
          width="25"
          @click.native="$refs.loader.load(save)"
        />
        <div
          v-else
        >
          <checkmarkSvg
            class="img float-right"
            :height="25"
            :width="25"
          />
          <span
            class="label float-right"
          >Saved</span>
        </div>
      </div>
      <div
        v-if="$root.updateReady"
        class="update-button float-right pointer"
        @click="$refs.loaderUpdate.load(updateVersion)"
      >
        <span><b> Update Available: </b></span>
        <span> Click to Download </span>
        <downloadSvg class="svg" />
      </div>
    </div>
    <TimingOverlay
      ref="loader"
    />
    <TimingOverlay
      ref="loaderUpdate"
    />
  </div>
</template>

<script>
import gearSvg from '../img/gear-icon.svg.vue';
import saveSvg from '../img/save.svg.vue';
import downloadSvg from '../img/download.svg.vue';
import checkmarkSvg from '../img/checkmark.svg.vue';
import TimingOverlay from '../components/TimingOverlay.vue';
import sleep from '../lib/sleep';
import OnlineSwitch from '../components/OnlineSwitch.vue';

export default {
  components:{
    gearSvg,
    saveSvg,
    checkmarkSvg,
    TimingOverlay,
    downloadSvg,
    OnlineSwitch
  },
  props: { 
    title: {
      type: String,
      required: false,
      default: ''
    },
    settingsButton: {
      type: Boolean,
      default: false,
      required: false
    },
    saveButton:{
      type: Boolean,
      default: false,
      required: false
    }
  },
  data(){
    return{
      saved: false,
    };
  },
  methods: {
    async save(){
      try{
        await this.$root.SaveBoth();
        this.saved = true;
        setTimeout(() => { this.saved = false; }, 1500);
      } catch (err) {
        alert(err);
      }
    },
    async updateVersion(){
      window.nodeAPI.electron.ipcRenderer.send('downloadUpdate');
      await sleep(120000);
      alert("Error downloading update");
    },
  }
};
</script>

<style lang="less" scoped>
  @import '../styles/colors.less';
  @import '../styles/z_indices.less';

  .header-bar {
    height: 55px;
    width: 100%;
    background-color: @black-darkest;
    color: #FFFFFF;
    display: flex;

    .title{
      font-size: 20px;
      font-weight: 300;
      letter-spacing: 0.7px;
      text-align: center;
      line-height: 55px;
    }

    .box{
      flex: 1;

      .update-button{
        background: @gold-mid;
        border-radius: 110px;
        margin-right: 20px;
        margin-top: 12px;
        height: 30px;
        min-width: 100px;
        padding-left: 10px;
        padding-right: 5px;
        z-index: @zMin;

        span{
          color: #000;
          font-size: 12px;
          line-height: 30px;
        }

        .svg{
          margin-top: 4px;
          margin-right: 5px;
          margin-left: 5px;
          float: right;
        }
      }

      .label{
        font-size: 10px;
        margin-right: 10px;
        margin-top: 22px;
      }

      .img{
        margin-top: 16px;
        margin-right: 20px;
      }

      .online-switch{
        margin-top: 18px;
        margin-left: 20px;
        display: inline-block;
      }

      .float-left{
        float: left;
      }

      .float-right{
        float: right;
      }

      .pointer{
        cursor: pointer;
      }
    }
  }
</style>
