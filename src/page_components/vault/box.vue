<template>
  <div v-if="box">
    <div class="wrapper">
      <div class="header">
        <div
          placeholder="Name"
          class="box_name"
          v-text="box.name"
        />
        <button
          class="add_secret"
          @click.prevent="add_secret"
        >
          <PlusIcon />
        </button>
      </div>
      <router-view />
    </div>
    <button
      class="save"
      @click.prevent="save"
    >
      Save
    </button>
  </div>
</template>

<script>
import PlusIcon from '../../img/plus-solid.svg';

export default {
  components:{
    PlusIcon
  },
  computed: {
    box_uuid(){ return this.$route.params.box_uuid; },
    box(){
      if(this.box_uuid){
        return this.$root.GetBox(this.box_uuid);
      }
      return {};
    },
  },
  methods: {
    async save(){
      await this.$root.SaveLocalVault();
      await this.$root.SaveCloudVaultIfEmail();
    },
    add_secret(){
      let secret_uuid = this.$root.CreateSecret(this.box_uuid);
      this.$router.push({name: 'secret', params: {box_uuid: this.box_uuid, secret_uuid: secret_uuid}});
    },
  }
};
</script>

<style lang="less" scoped>
  .wrapper {
    border-radius: 6px;
    background-color: #080D0E;
    margin: 25px;
    padding-left: 27px;
    padding-right: 27px;
    padding-bottom: 27px;

    .header{
      border-bottom: 1px solid #2F3235;
    }

    .box_name {
      font-size: 22px;
      border: none;
      border-radius: 6px;
      background: transparent;
      color: #8C8E8F;
      width: ~'calc(100% - 150px)';
      display: inline-block;
      height: 60px;
      line-height: 60px;
    }

    .add_secret {
      border: none;
      background: transparent;
      float: right;
      cursor: pointer;
      margin-top: 20px;
      outline: none;

      &:hover{
        svg{
          path{
            fill: #D8A22E
          }
        }
      }
    }
  }

  .save {
    padding: 10px;
    font-size: 22px;
    margin: 25px;
    color: #8C8E8F;
    background: transparent;
    border: 1px solid #7E8A95;
    border-radius: 6px;
    cursor: pointer;
  }
</style>
