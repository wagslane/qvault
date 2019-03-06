<template>
  <div class="rectangle" v-bind:style="position">
    <div class="absolute">
      <img height="25" width="25" src="../img/qvault-logo.png">
    </div>
    <span>{{title}}</span>
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
  .rectangle {
    height: 55px;
    width: 100%;
    background-color: #080D0E;
    color: #FFFFFF;
    font-size: 20px;
    font-weight: 300;
    letter-spacing: 0.7px;
    line-height: 55px;
    text-align: center;
  }
  img{
    float: left;
    margin-top: 16px;
    margin-left: 18px;
  }
  .absolute{
    position: absolute;
  }
</style>
