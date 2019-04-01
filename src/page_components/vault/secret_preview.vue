<template>
  <div class="secret secret-preview">
    <span class="name">
      {{ secret[boxType.quick_access_name] }}
    </span>
    <input
      v-model="secret[boxType.quick_access_secret]"
      class="value"
      readonly
    >
    <router-link
      :to="{name: 'secret', params: {box_uuid: boxUuid, secret_uuid: secretUuid}}"
      class="shape"
    >
      <div class="icon">
        <div class="shape" />
      </div>
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
      type: Object,
      required: true
    },
    boxType:{
      type: Object,
      required: true
    }
  },
};
</script>

<style lang="less" scoped>
  @import '../../styles/secrets.less';

  .secret-preview {
    display: flex;
    flex-direction: row;
    margin-left: -15px;

    .name{
      padding: 10px;
      color: white;
      margin-left: 15px;
      margin-right: 15px;
      display: inline-block;
    }

    .value{
      padding: 10px;
      border: 1px solid #7E8A95;
      border-radius: 6px;
      background: transparent;
      color: #8C8E8F;
      margin-left: 15px;
      flex-grow: 1;
      flex-basis: 200px;
    }

    .icon{
      cursor: pointer;
      flex-basis: 75px;

      .shape {
        margin-left: 20px;
        margin-top: 16px;
        transform: rotate(45deg);
        box-sizing: border-box;
        height: 12px;
        width: 12px;
        border-top: 1.5px solid #8C8E8F;
        border-right: 1.5px solid #8C8E8F;
      }
    }
  }
</style>
