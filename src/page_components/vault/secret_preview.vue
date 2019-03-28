<template>
  <div class="secret secret_preview">
    <input
      v-for="quick_access_field in box_type.quick_access_fields"
      v-model="secret[quick_access_field]"
      :placeholder="quick_access_field"
      class="secret_value"
      readonly
    >
    <router-link
      :to="{name: 'secret', params: {box_uuid: box_uuid, secret_uuid: secret_uuid}}"
    >
      >
    </router-link>
  </div>
</template>

<script>
  export default {
    props: [
      'box_uuid',
      'secret_uuid',
      'secret',
      'box_type',
    ],
  }
</script>

<style lang="less" scoped>
  @import '../../styles/secrets.less';

  .secret_preview {
    display: flex;
    flex-direction: row;

    > input {
      flex-grow: 2;
    }

    > a {
      flex-grow: 1;
      color: white;
      text-decoration: none;
      font-size: 2em;
      text-align: center;
      padding-left: 15px;
      padding-right: 15px;
      display: inline-block;
    }
  }

  .secret_value {

  }
</style>
