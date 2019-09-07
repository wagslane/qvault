<template>
  <div
    class="dropdown_menu_wrapper"
  >
    <div
      class="dropdown_menu_icon"
      @click.prevent="toggle"
    >
      <span v-html="menu_svg" />
    </div>
    <div
      v-click-outside="hide"
      class="dropdown_menu"
      :class="{show}"
    >
      <div
        v-for="(action, index) in actions"
        :key="index"
        class="action"
        :class="{fill: action.fill}"
        @click.prevent="$emit(action.method);"
      >
        <div
          v-if="action.icon"
          class="svg-container"
          v-html="action.icon"
        />
        <span>{{ action.label }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import menu_svg from '../img/menu.svg';

export default {
  directives: {
    'click-outside': {
      bind: function(el, binding) {
        if (typeof binding.value !== 'function') {
          return;
        }
        const bubble = binding.modifiers.bubble;
        const handler = (e) => {
          if (bubble || (!el.contains(e.target) && el !== e.target)) {
            binding.value(e);
          }
        };
        el.__vueClickOutside__ = handler;
        document.addEventListener('click', handler);
      },
      unbind: function(el) {
        document.removeEventListener('click', el.__vueClickOutside__);
        el.__vueClickOutside__ = null;
      }
    }
  },
  props: {
    actions:{
      type: Array,
      required: true,
    }
  },
  data(){
    return {
      menu_svg,
      show: false,
      canHide: true
    };
  },
  methods:{
    toggle(){
      this.show = !this.show;
      this.canHide = false;
      setTimeout(() => this.canHide = true, 10);
    },
    hide(){
      if (this.canHide){
        this.show = false;
      }
    }
  }
};
</script>

<style lang="less">
  @import '../styles/colors.less';
  @import '../styles/z_indices.less';

  .dropdown_menu_wrapper {
    position: relative;

    .dropdown_menu_icon {
      cursor: pointer;
      padding-left: 15px;
      padding-right: 15px;

      svg {
        path {
          fill: @gray-darker;
        }
      }

      &:hover{
        svg {
          path {
            fill: @gold-mid;
          }
        }
      }
    }

    .dropdown_menu {
      top: 100%;
      right: 0;
      position: absolute;
      border: 1px solid white;
      background-color: black;
      box-shadow: 0 4px 24px #000000;
      border-radius: 6px;
      overflow: hidden;
      z-index: @zDropdownMenu;

      &:not(.show){
        display: none;
      }

      .action {
        white-space: nowrap;
        color: @gray-darker;
        padding: 10px;
        cursor: pointer;
        text-align: left;

        .svg-container{
          display: inline;
        }

        svg {
          path {
            stroke: @gray-darker;
          }
          line {
            stroke: @gray-darker;
          }
          rect {
            stroke: @gray-darker;
          }
          polygon {
            stroke: @gray-darker;
          }
        }

        &:hover{
          background-color: @gray-mid;
          color: white;

          svg {
            path {
              stroke: white;
            }
            line {
              stroke: white;
            }
            rect {
              stroke: white;
            }
            polygon {
              stroke: white;
            }
          }
        }

        &:active{
          background-color: @gray-lighter;
        }
      }

      .fill {
        svg {
          path {
            fill: @gray-darker;
          }
          rect {
            fill: @gray-darker;
          }
          polygon {
            fill: @gray-darker;
          }
        }
        &:hover{
          svg {
            path {
              fill: white;
            }
            rect {
              fill: white;
            }
            polygon {
              fill: white;
            }
          }
        }
      }
    }
  }
</style>
