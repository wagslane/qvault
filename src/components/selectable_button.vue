<template>
  <div
    class="button"
    v-on:input="$emit('input', new_value)"
    :class="{selected}"
  >
    <slot></slot>
  </div>
</template>

<script>
  export default {
    props: [
      'new_value',
      'value',
    ],
    computed: {
      selected(){
        return this.new_value === this.value;
      }
    },
  }
</script>

<style lang="less" scoped>
  .button {
    height: 110px;
    width: 140px;
    border-radius: 9px;
    text-align: center;
    font-size: 14px;
    color: #999B9C;
    background-color: #42454A;
    margin: 20px;
    padding: 25px;
    cursor: pointer;

    &.selected {
      color: #CE9B2C;
      background-color: #080D0E;
      border: 1px solid #CE9B2C;
    }
  }
</style>
