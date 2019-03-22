<template>
  <note_secret
    v-if="box_name === 'Notes'"
    :secret="secret"
    :fields="fields"
  ></note_secret>
  <form
    v-else
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
  import note_secret from './boxes/notes.vue';

  export default {
    components: {
      note_secret,
    },
    props: [
      'box_name',
      'secret',
      'fields',
    ],
  }
</script>

<style lang="less" scoped>
  @import '../../styles/secrets.less';
</style>
