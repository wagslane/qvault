<template>
  <div>
    <div id="box-header">
      <input
        placeholder="Name"
        class="box_name"
        v-model="box.name"
        :readonly="box.type != 'Other'"
      />
      <dropdown_menu
        class="dropdown-menu"
        :actions="dropdown_menu_actions"
        @delete_box="delete_box"
      />
      <button
        class="add_secret"
        @click.prevent="$parent.add_secret"
      >
        <PlusSolid />
      </button>
    </div>
    <secret_preview
      v-for="secret_uuid in secret_uuids"
      :key="secret_uuid"
      :box-uuid="box_uuid"
      :secret-uuid="secret_uuid"
      :secret="box.secrets[secret_uuid]"
      :box-type="box_type"
    />
  </div>
</template>

<script>
import box_types from '../../consts/box_types.es6';
import secret_preview from './secret_preview.vue';
import PlusSolid from '../../img/plus-solid.svg.vue';
import dropdown_menu from '../../components/dropdown_menu.vue';
import trash_svg from '../../img/trash.svg';

export default {
  components: {
    secret_preview,
    PlusSolid,
    dropdown_menu
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
        return Object.keys(this.box.secrets);
      }
      return [];
    },
    dropdown_menu_actions(){
      return [
        {
          label: 'Delete Box',
          method: 'delete_box',
          icon: trash_svg,
        }
      ];
    },
  },
  methods: {
    delete_box(){
      try{
        this.$root.DeleteBox(this.box_uuid);
        this.$router.push({name: 'vault'});
      } catch(err){
        alert(err);
      }
    }
  },
};
</script>

<style lang="less">
  @import '../../styles/colors.less';

  #box-header{
    border-bottom: 1px solid @black-lighter;

    .box_name {
      font-size: 22px;
      border: none;
      border-radius: 6px;
      background: transparent;
      color: @gray-light;
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
    }

    .dropdown-menu{
      margin-top: 20px;
      float: right;
    }
  }
</style>
