<template>
  <div>
    <HeaderBar
      title="Vault"
      settings-button
      save-button
    />
    <div
      v-if="boxes"
      class="container"
    >
      <div
        class="sidebar"
        :style="{ height: `calc(100vh - ${contentHeight}px)` }"
      >
        <div class="boxes">
          <router-link
            v-for="sortedBox in sortedBoxes"
            :key="sortedBox.uuid"
            :to="{name: 'Box', params: {boxUUID: sortedBox.uuid}}"
            class="box_link"
            :class="{
              'button-fill': sortedBox.icon.fill,
              'button-stroke': !(sortedBox.icon.fill)
            }"
          >
            <span v-html="sortedBox.icon.img" />
            <div class="aesthetic_rectangle" />
            {{ sortedBox.type === 'other' ? sortedBox.customName : sortedBox.displayName }}
            <br>
            <span class="updated">{{ sortedBox.updated }}</span>
          </router-link>
        </div>
        <router-link
          :to="{name: 'AddBox'}"
          class="add-box"
        >
          <PlusBox />
          <span>
            Add New Box
          </span>
        </router-link>
      </div>
      <div
        class="content"
        :style="{ height: `calc(100vh - ${contentHeight}px)` }"
      >
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import PlusBox from '../../img/plus-box.svg.vue';
import {heightMac, heightWin} from '../../consts/titleBar';
import boxDefinitions from '../../consts/boxDefinitions';

export default {
  components:{
    PlusBox
  },
  computed: {
    boxes(){
      return this.$root.secrets;
    },
    contentHeight(){
      const header_bar_height = 55;
      if (window.nodeAPI.os.type() === 'Darwin'){
        return header_bar_height + heightMac;
      }
      return header_bar_height + heightWin;
    },
    sortedBoxes(){
      let sortedBoxes = [];
      for (let key in this.boxes) {
        if (this.boxes.hasOwnProperty(key)) {
          let box = this.boxes[key];
          let boxDefinition = boxDefinitions.find(def => def.key === box.type);
          sortedBoxes.push({
            uuid: key,
            updated: this.formatCreatedDate(box.updated),
            customName: box.name,
            displayName: boxDefinition.displayName,
            icon: boxDefinition.icon,
            type: boxDefinition.key
          });
        }
      }
      return sortedBoxes.sort((a, b) => a.displayName < b.displayName ? -1 : 1);
    },
  },
  watch: {
    sortedBoxes(newBoxes){
      this.addBoxIfNone(newBoxes);
    },
  },
  created(){
    if (this.$store.getters.getNextConflict){
      this.$router.push({name: 'ResolveConflicts'});
    }
  },
  mounted(){
    this.addBoxIfNone(this.sortedBoxes);
  },
  methods: {
    formatCreatedDate(timestamp){
      const d = new Date(timestamp);
      return `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}-${('0' + d.getDate()).slice(-2)}`;
    },
    addBoxIfNone(boxes){
      if(!boxes.length){
        if(this.$router.currentRoute.fullPath === "/vault"){
          this.$router.push({name: 'AddBox'});
        }
      }
    },
  },
};
</script>

<style lang="less">
  @import '../../styles/colors.less';
  
  .container {
    display: flex;
    flex-direction: row;

    .sidebar {
      background-color: @black-lighter;
      position: relative;
      flex-grow: 1;
      flex-basis: 0;

      .boxes {
        bottom: 75px;
        right: 0;
        left: 0;
        top: 0px;
        position: absolute;
        overflow-y: auto;

        .box_link {
          color: white;
          padding: 22px;
          display: block;
          text-decoration: none;

          .updated {
            color: @gray-dark;
            font-size: 10px;
          }

          svg {
            float: left;
            height: 26px;
            width: 26px;
            margin-right: 12px;
          }

          &.router-link-active {
            color: @gold-mid;
            background-color: @black-dark;
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

          &.router-link-active {
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

          &.router-link-active {
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

      .add-box {
        height: 75px;
        text-align: center;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: @black-mid;
        border: none;
        font-size: 14px;
        display: block;
        text-decoration: none;
        color: @gray-mid;

        svg{
          margin-right: 16px;
          vertical-align: middle;

          path {
            fill: @gray-mid;
          }
          rect {
            stroke: @gray-mid;
          }
        }

        span{
          line-height: 75px;
        }

        &:hover {
          color: @gold-dark;
          background-color: @black-darkest;

          svg {
            path {
              fill: @gold-dark;
            }
            rect {
              stroke: @gold-dark;
            }
          }
        }
      }
    }

    .content {
      flex-grow: 3;
      flex-basis: 0;
      overflow-y: auto;
    }
  }
</style>
