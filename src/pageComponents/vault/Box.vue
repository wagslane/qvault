<template>
  <div v-if="box">
    <div class="wrapper">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    boxUUID(){ return this.$route.params.boxUUID; },
    box(){
      if(this.boxUUID){
        return this.$root.GetBox(this.boxUUID);
      }
      return {};
    },
  }
};
</script>

<style lang="less" scoped>
  @import '../../styles/colors.less';
  
  .wrapper {
    border-radius: 6px;
    background-color: @black-darkest;
    margin: 25px;
    padding-left: 27px;
    padding-right: 27px;
    padding-bottom: 27px;
  }
</style>
