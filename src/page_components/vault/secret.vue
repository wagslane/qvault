<template>
  <form
    class="wrapper"
  >
    <input
      v-model="secret.name"
      placeholder="Name"
      class="box_name"
    >
    <hr />
    <div
      v-for="field in fields"
      class="secret"
    >
      <div class="secret_name">{{field}}</div>
      <input
        placeholder="value"
        v-model="secret[field]"
        class="secret_value"
      >
      <!--<button v-clipboard:copy="secret.value">copy</button>-->
    </div>
  </form>
</template>

<script>
  export default {
    props: [
      'secret',
      'fields',
    ],
  }
</script>

<style lang="less" scoped>
  .wrapper {
    border-radius: 6px;
    background-color: #080D0E;
    margin: 25px;
    padding: 15px;

    .box_name {
      font-size: 22px;
      border: none;
      border-radius: 6px;
      background: transparent;
      color: #8C8E8F;
      width: ~'calc(100% - 150px)';
      padding: 10px;
    }

    hr {
      box-sizing: border-box;
      height: 2px;
      border: 1px solid #2F3235;
      margin: 10px;
    }
  }

  .secret {
    font-size: 18px;
    margin-bottom: 10px;

    .secret_name {
      padding: 10px;
      border: none;
      border-radius: 6px;
      background: transparent;
      color: white;
      width: ~'calc(50% - 15px)';
      margin-right: 15px;
      display: inline-block;
    }

    .secret_value {
      padding: 10px;
      border: 1px solid #7E8A95;
      border-radius: 6px;
      background: transparent;
      color: #8C8E8F;
      width: ~'calc(50% - 75px)';
      margin-left: 15px;
    }
  }
</style>
