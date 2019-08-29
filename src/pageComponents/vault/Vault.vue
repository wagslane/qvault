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
        :style="{ height: `calc(100vh - ${content_height}px)` }"
      >
        <div class="boxes">
          <router-link
            v-for="sorted_box in sorted_boxes"
            :key="sorted_box.uuid"
            :to="{name: 'Box', params: {boxUUID: sorted_box.uuid}}"
            class="box_link"
            :class="{
              'button-fill': sorted_box.icon.fill,
              'button-stroke': !(sorted_box.icon.fill)
            }"
          >
            <span v-html="sorted_box.icon.img" />
            <div class="aesthetic_rectangle" />
            {{ sorted_box.name }}
            <br>
            <span class="created">{{ sorted_box.created }}</span>
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
        :style="{ height: `calc(100vh - ${content_height}px)` }"
      >
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import PlusBox from '../../img/plus-box.svg.vue';
import {heightMac, heightWin} from '../../consts/title_bar';
import box_types from '../../consts/box_types';

function sort_box_by_key(key){
  return function(a, b){
    if(a[key] < b[key]) return -1;
    if(a[key] > b[key]) return 1;
    return 0;
  };
}

export default {
  components:{
    PlusBox
  },
  data(){
    return {
      'sort': 'name',
      'search': null,
    };
  },
  computed: {
    boxes(){
      return this.$root.secrets;
    },
    content_height(){
      const header_bar_height = 55;
      if (window.nodeAPI.os.type() === 'Darwin'){
        return header_bar_height + heightMac;
      }
      return header_bar_height + heightWin;
    },
    sorted_boxes(){
      let sorted_boxes = [];
      for (let key in this.boxes) {
        if (this.boxes.hasOwnProperty(key)) {
          let box = this.boxes[key];
          let box_type = box_types.find(box_type => box_type.key === box.type);
          sorted_boxes.push({
            uuid: key,
            created: this.formatCreatedDate(box.created),
            name: box.name,
            icon: box_type && box_type.icon,
          });
        }
      }
      if(this.search){
        sorted_boxes = sorted_boxes.filter(
          sorted_box => this.box_matches_search(sorted_box)
        );
      }
      if(this.sort){
        sorted_boxes = sorted_boxes.sort(sort_box_by_key(this.sort));
      }
      return sorted_boxes;
    },
  },
  watch: {
    sorted_boxes(newBoxes){
      this.addBoxIfNone(newBoxes);
    },
  },
  created(){
    if (this.$store.getters.getNextConflict){
      this.$router.push({name: 'ResolveConflicts'});
    }
  },
  mounted(){
    this.addBoxIfNone(this.sorted_boxes);
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
    box_matches_search(sorted_box){
      if(sorted_box.name.toLowerCase().includes(this.search.toLowerCase())){
        return true;
      }
      let box = this.boxes[sorted_box.uuid];
      for (let key in box.secrets) {
        if (box.secrets.hasOwnProperty(key)) {
          let secret = box.secrets[key];
          if(secret.name.toLowerCase().includes(this.search.toLowerCase())){
            return true;
          }
        }
      }
    }
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

          .created {
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
