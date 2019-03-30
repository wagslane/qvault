<template>
  <div class="secret secret_preview">
    <input
      v-for="quick_access_field in box_type.quick_access_fields"
      :key="quick_access_field"
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
  props: {
    boxUuid:{
      type: String,
      required: true
    },
    secretUuid:{
      type: String,
      required: true
    },
    secret:{
      type: String,
      required: true
    },
    boxType:{
      type: String,
      required: true
    }
  },
};
</script>

<style lang="less" scoped>
  @import '../../styles/secrets.less';

  .secret_preview {
    display: flex;
    flex-direction: row;
    margin-left: -15px;

    > a {
      color: white;
      text-decoration: none;
      font-size: 2em;
      text-align: center;
      display: inline-block;
      width: 42px;
      margin-left: 15px;
    }
  }
</style>
