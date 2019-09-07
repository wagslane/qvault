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
        :key="box_type.key"
        class="button"
        :class="(box_type.icon.fill ? 'button-fill' : 'button-stroke')"
        @click="add_box(box_type)"
      >
        <span v-html="box_type.icon.img" />
        <div>
          {{ box_type.displayName }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import box_types from '../../consts/box_types';

export default {
  computed: {
    filtered_box_types(){
      return box_types.filter(
        box_type => !this.$root.HasBoxType(box_type.key) || box_type.key === 'other'
      );
    },
  },
  methods: {
    add_box(box_type){
      let name = box_type.displayName;
      let type = box_type.key;
      if(type === 'other'){
        let rep = 1;
        while(this.$root.HasBoxName(name)){
          name = `${box_type.displayName} ${rep}`;
          rep++;
        }
      }
      let boxUUID = this.$root.CreateBox(
        name,
        type,
      );
      this.$router.push({name: 'Box', params: {boxUUID: boxUUID}});
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
