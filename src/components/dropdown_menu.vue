<template>
  <div class="dropdown_menu_wrapper">
    <div
      class="dropdown_menu_icon"
      @click.prevent="show = !show"
    >
      <span v-html="menu_svg" />
    </div>
    <div
      class="dropdown_menu"
      :class="{show}"
    >
      <div
        v-for="action in actions"
        class="action"
        @click.prevent="action.method"
      >
        <span
          v-if="action.icon"
          v-html="action.icon"
        />
        {{ action.label }}
      </div>
    </div>
  </div>
</template>

<script>
import menu_svg from '../img/menu.svg';

export default {
  props: {
    actions: Array,
  },
  data(){
    return {
      menu_svg,
      show: false,
    };
  },
};
</script>

<style lang="less" scoped>
  @import '../styles/colors.less';

  .dropdown_menu_wrapper {
    position: relative;

    .dropdown_menu_icon {
      margin-left: 15px;
      cursor: pointer;
      padding-left: 15px;
      padding-right: 15px;
    }

    .dropdown_menu {
      top: 100%;
      right: 0;
      position: absolute;
      border: 1px solid white;
      background-color: black;
      box-shadow: 0 4px 24px #000000;
      border-radius: 6px;
      padding: 5px;

      &:not(.show){
        display: none;
      }

      .action {
        white-space: nowrap;
        color: white;
        padding: 10px;
        cursor: pointer;

        svg {
          path, line {
            stroke: white;
          }
        }

        &:hover {
          color: @gray-light;

          svg {
            path, line {
              stroke: @gray-light;
            }
          }
        }
      }
    }
  }
</style>
