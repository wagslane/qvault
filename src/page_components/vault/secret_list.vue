<template>
  <div class="wrapper secret_list">
    <secret_preview
      v-for="secret_uuid in secret_uuids"
      :key="secret_uuid"
      :box_uuid="box_uuid"
      :secret_uuid="secret_uuid"
      :secret="box.secrets[secret_uuid]"
      :box_type="box_type"
    ></secret_preview>
  </div>
</template>

<script>
  import box_types from '../../consts/box_types.es6';

  import secret_preview from './secret_preview.vue';

  export default {
    components: {
      secret_preview,
    },
    computed: {
      box_uuid() {
        return this.$parent.box_uuid;
      },
      box() {
        return this.$parent.box;
      },
      box_type(){
        return box_types.find(box_type => box_type.name === this.box.type);
      },
      secret_uuids(){
        if(this.box){
          return Object.keys(this.box.secrets)
        }
      },
    },
  }
</script>
