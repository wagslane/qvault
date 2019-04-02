<template>
  <div class="bar">
    <span>{{ percentage }}</span>
  </div>
</template>

<script>
export default {
  props: { 
    bytes: {
      type: Number,
      required: true
    }
  },
  data(){
    return {
      maxBytes: 25000.0
    };
  },
  computed:{
    percentage(){
      return this.bytes / this.maxBytes;
    }
  }
};
</script>

<style lang="less" scoped>
  .bar {

  }
</style>
