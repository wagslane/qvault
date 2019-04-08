<template>
  <div
    class="secret-preview"
    :class="{'conflict': secret.conflict}"
  >
    <router-link
      :to="{name: 'secret', params: {box_uuid: boxUuid, secret_uuid: secretUuid}}"
    >
      <span class="name">{{ quickAccessName }}</span>
    </router-link>
    <input
      v-for="(fieldname, i) in definedQuickAccessSecrets"
      :key="i"
      v-model="secret[fieldname]"
      class="value"
      readonly
    >
    <div
      v-if="definedQuickAccessSecrets.length < 1"
      class="spacer"
    />
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
  @import '../../styles/colors.less';

  .secret-preview {
    display: flex;
    flex-direction: row;
    margin-top: 15px;

    &.conflict {
      .name {
        color: red!important;
      }
    }

    .name{
      color: white;
      display: inline-block;
      height: 45px;
      line-height: 45px;
      flex-grow: 1;

      &:hover{
        color: @gold-mid;
      }
    }

    .value{
      padding: 10px;
      border: 1px solid @gray-blue;
      border-radius: 6px;
      background: transparent;
      color: @gray-light;
      margin-left: 30px;
      flex-grow: 2;
      flex-basis: 200px;
    }

    .spacer{
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
        border-top: 1.5px solid @gray-light;
        border-right: 1.5px solid @gray-light;
      }

      &:hover{
        .shape{
          border-top: 1.5px solid @gold-mid;
          border-right: 1.5px solid @gold-mid;
        }
      }
    }
  }
</style>
