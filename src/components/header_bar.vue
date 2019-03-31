<template>
  <div class="bar">
    <img 
      class="img img-left" 
      height="25" 
      width="25" 
      src="../img/qvault-logo.png"
    >
    <span>{{ title }}</span>
    <gearIcon 
      v-if="settings"
      class="img img-right"
      height="25"
      width="25"
      src="../img/gear-icon.svg"
      @click="$router.push({name: 'settings'})"
    />
  </div>
</template>

<script>
import gearIcon from '../img/gear-icon.svg';

export default {
  components:{
    gearIcon
  },
  props: { 
    title: {
      type: String,
      required: false,
      default: ''
    },
    settings: {
      type: Boolean,
      default: false,
      required: false
    }
  }
};
</script>

<style lang="less" scoped>
  .bar {
    height: 55px;
    width: 100%;
    background-color: #080D0E;
    line-height: 55px;
    color: #FFFFFF;
    font-size: 20px;
    font-weight: 300;
    letter-spacing: 0.7px;
    text-align: center;
    position: relative;

    .img{
      margin-top: 16px;
      position: absolute;
    }

    .img-left{
      left: 20px;
    }

    .img-right{
      right: 20px;
      cursor: pointer;
    }
  }
</style>
