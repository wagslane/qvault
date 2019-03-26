<template>
  <div class="bar" v-bind:style="position">
    <img 
      class="img-left" 
      height="25" 
      width="25" 
      src="../img/qvault-logo.png">
    <span>{{title}}</span>
    <img
      v-if="settings"
      class="img-right"
      height="25"
      width="25"
      src="../img/gear-icon.svg"
      @click="$router.push({name: 'settings'})">
  </div>
</template>

<script>
  export default {
    props: { 
      title: {
        type: String,
        required: false
      },
      fixed: {
        type: Boolean,
        default: false,
        required: false
      },
      settings: {
        type: Boolean,
        default: false,
        required: false
      }
    },
    computed:{
      position(){
        if (this.fixed){
          return { position: 'fixed' }
        }
        return {}
      }
    }
  }
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

    img{
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
