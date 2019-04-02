<template>
  <div class="secret-preview">
    <span class="name">
      {{ quickAccessName }}
    </span>
    <input
      v-for="(fieldname, i) in definedQuickAccessSecrets"
      :key="i"
      v-model="secret[fieldname]"
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
  computed: {
    quickAccessName(){
      if(this.secret[this.boxType.quick_access_name]){
        return this.secret[this.boxType.quick_access_name];
      }
      return "Unnamed Secret";
    },
    definedQuickAccessSecrets(){
      return this.boxType.quick_access_secrets.filter((fieldname) => {
        if (this.secret[fieldname]){
          return true;
        }
        return false;
      });
    }
  }
};
</script>

<style lang="less" scoped>
  @import '../../styles/secrets.less';

  .secret-preview {
    display: flex;
    flex-direction: row;
    margin-top: 15px;

    .name{
      color: white;
      display: inline-block;
      height: 45px;
      line-height: 45px;
      flex-grow: 1;
    }

    .value{
      padding: 10px;
      border: 1px solid #7E8A95;
      border-radius: 6px;
      background: transparent;
      color: #8C8E8F;
      margin-left: 30px;
      flex-grow: 2;
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
