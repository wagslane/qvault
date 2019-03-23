<template>
  <note_secret
    v-if="box_name === 'Notes'"
    :secret="secret"
    :fields="fields"
  ></note_secret>
  <financial_secret
    v-else-if="box_name === 'Financial Institution'"
    :secret="secret"
    :fields="fields"
  ></financial_secret>
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
      <!--<button v-clipboard:copy="secret[field]">copy</button>-->
    </div>
  </form>
</template>

<script>
  import note_secret from './boxes/notes.vue';
  import financial_secret from './boxes/financial.vue';

  export default {
    components: {
      note_secret,
      financial_secret,
    },
    props: {
      'box_name': String,
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
  @import '../../styles/secrets.less';
</style>
