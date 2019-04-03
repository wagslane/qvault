<template>
  <div class="bar">
    <div class="text">
      {{ percentage }}% cloud storage usage
    </div>
    <div
      class="percentage"
      :style="percentageStyle"
    />
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
    percentageStyle(){
      return { width: `${this.percentage}%`};
    },
    percentage(){
      return Math.round((this.bytes * 100) / this.maxBytes);
    }
  }
};
</script>

<style lang="less" scoped>
  .bar {
    height: 30px;
    line-height: 30px;
    width: 100%;
    background-color: #333739;
    border: 2px solid rgba(255,255,255,0.5);
    border-radius: 5px;
    position: relative;

    .text{
      font-size: 12px;
      text-align: center;
      color: white;
      position: absolute;
      z-index: 2;
      width: 100%;
      height: 100%;
      left: 0;
    }

    .percentage{
      position: absolute;
      left: 0;
      height: 100%;
      background-color: #CE9B2C;
      z-index: 1;
    }
  }
</style>
