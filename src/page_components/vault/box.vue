<template>
  <div v-if="box">
    <div class="wrapper">
      <router-view />
    </div>
    <button
      class="save"
      :disabled="$root.ConflictExists"
      :title="$root.ConflictExists ? 'Vault cannot be saved until all conflicts are resolved' : ''"
      @click.prevent="save"
    >
      Save
    </button>
  </div>
</template>

<script>
export default {
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
      await this.$root.SaveBoth();
    },
    add_secret(){
      let secret_uuid = this.$root.CreateSecret(this.box_uuid);
      this.$router.push({name: 'secret', params: {box_uuid: this.box_uuid, secret_uuid: secret_uuid}});
    },
  }
};
</script>

<style lang="less" scoped>
  @import '../../styles/colors.less';
  
  .wrapper {
    border-radius: 6px;
    background-color: @black-darkest;
    margin: 25px;
    padding-left: 27px;
    padding-right: 27px;
    padding-bottom: 27px;
  }

  .save {
    padding: 10px;
    font-size: 22px;
    margin: 25px;
    color: @gray-light;
    background: transparent;
    border: 1px solid @gray-blue;
    border-radius: 6px;
    cursor: pointer;
  }
</style>
