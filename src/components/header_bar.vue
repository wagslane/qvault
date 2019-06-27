<template>
  <div class="header-bar">
    <div class="box">
      <img 
        class="img" 
        :style="{marginLeft: '20px'}"
        height="25" 
        width="25" 
        src="../img/qvault-logo.png"
      >
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
        :style="{marginRight: '20px'}"
        @click.native="$router.push({name: 'settings'})"
      />
      <div v-if="saveButton">
        <saveSvg
          v-if="!saved"
          class="img float-right pointer"
          height="25"
          width="25"
          :style="{marginRight: '20px'}"
          :disabled-status="$root.ConflictExists"
          :title-text="$root.ConflictExists ? 'Vault cannot be saved until all conflicts are resolved' : 'Save Vault'"
          @click.native="$refs.loader.load(save)"
        />
        <div
          v-else
        >
          <checkmarkSvg
            class="img float-right"
            :style="{marginRight: '20px'}"
            :height="25"
            :width="25"
          />
          <span
            :style="{marginRight: '10px'}"
            class="label float-right"
          >Vault Saved</span>
        </div>
      </div>
    </div>
    <timingOverlay
      ref="loader"
    />
  </div>
</template>

<script>
import gearSvg from '../img/gear-icon.svg.vue';
import saveSvg from '../img/save.svg.vue';
import checkmarkSvg from '../img/checkmark.svg.vue';
import timingOverlay from '../components/timing_overlay.vue';

export default {
  components:{
    gearSvg,
    saveSvg,
    checkmarkSvg,
    timingOverlay
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
  }
};
</script>

<style lang="less" scoped>
  @import '../styles/colors.less';

  .header-bar {
    height: 55px;
    width: 100%;
    background-color: @black-darkest;
    line-height: 55px;
    color: #FFFFFF;
    display: flex;

    .title{
      font-size: 20px;
      font-weight: 300;
      letter-spacing: 0.7px;
      text-align: center;
    }

    .box{
      flex: 1;

      .label{
        font-size: 10px;
      }

      .img{
        margin-top: 16px;
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
