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
    box_uuid(){ return this.$route.params.box_uuid; },
    box(){
      if(this.box_uuid){
        return this.$root.GetBox(this.box_uuid);
      }
      return {};
    },
  },
  methods: {
    add_secret(){
      this.$router.push({name: 'secret', params: {box_uuid: this.box_uuid}});
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
