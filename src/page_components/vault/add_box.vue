<template>
  <div
    id="add_box"
    class="modal"
  >
    <h1>Add A Box</h1>
    <p>A box is a group of secrets stored in your vault</p>
    <div class="buttons">
      <div
        v-for="box_type in filtered_box_types"
        :key="box_type.name"
        class="button"
        :class="(box_type.icon.fill ? 'button-fill' : 'button-stroke')"
        @click="add_box(box_type.name)"
      >
        <span v-html="box_type.icon.img" />
        <div>
          {{ box_type.name }}
        </div>
      </div>
      <!--<div-->
      <!--class="button"-->
      <!--v-on:click="add_box('Other')"-->
      <!--&gt;-->
      <!--<other_icon></other_icon>-->
      <!--<br />-->
      <!--Other-->
      <!--</div>-->
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    filtered_box_types(){
      return this.$root.box_types.filter(
        box_type =>
          !(this.$root.HasBox(box_type.name))
      );
    },
  },
  methods: {
    add_box(type){
      let box_uuid = this.$root.CreateBox(
        type,
        type,
      );
      this.$router.push({name: 'box', params: {box_uuid: box_uuid}});
    },
  },
};
</script>

<style lang="less">
  @import '../../styles/colors.less';

  #add_box {
    &.modal {
      margin: 15px;
      text-align: center;
      color: white;
    }

    .buttons {
      max-width: calc(180px * 3);
      margin: auto;

      .button {
        display: inline-block;
        height: 110px;
        width: 140px;
        border-radius: 9px;
        text-align: center;
        font-size: 14px;
        color: @gray-lighter;
        background-color: @black-lightest;
        margin: 20px;
        padding: 25px;
        cursor: pointer;
        border: 1px solid @black-lightest;
        vertical-align: top;

        svg {
          width: 28px;
          height: 28px;
          margin-bottom: 13px;
        }

        &:hover {
          color: @gold-dark;
          background-color: @black-darkest;
          border: 1px solid @gold-dark;
        }

        &:nth-child(3n):after {
          content: '\A';
          display: block;
        }
      }

      .button-stroke {
        svg {
          path {
            stroke: @gray-lighter;
          }
          rect {
            stroke: @gray-lighter;
          }
        }

        &:hover {
          svg {
            path {
              stroke: @gold-dark;
            }
            rect {
              stroke: @gold-dark;
            }
          }
        }
      }

      .button-fill {
        svg {
          path {
            fill: @gray-lighter;
            stroke: @gray-lighter;
          }
          rect {
            stroke: @gray-lighter;
          }
        }

        &:hover {
          svg {
            path {
              fill: @gold-dark;
              stroke: @gold-dark;
            }
            rect {
              stroke: @gold-dark;
            }
          }
        }
      }
    }
  }
</style>
