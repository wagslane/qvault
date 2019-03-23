<template>
  <form
    class="wrapper"
  >
    <input
      v-model="secret['Name']"
      placeholder="Name"
      class="box_name"
    >
    <hr />
    <textarea
      v-for="field in fields"
      :placeholder="field"
      v-model="secret[field]"
      class="note"
    ></textarea>
  </form>
</template>

<script>
  export default {
    props: {
      'secret': {
        type: Object,
        required: true,
      },
      'fields': {
        type: Array,
        required: true,
      },
    },
  }
</script>

<style lang="less" scoped>
  @import '../../../styles/secrets.less';

  .note {
    padding: 10px;
    border: 1px solid #7E8A95;
    border-radius: 6px;
    background: transparent;
    color: #8C8E8F;
    width: 100%;
  }
</style>
