<template>
  <div>
    <HeaderBar
      title="Vault"
      settings
    />
    <ProgressBar :bytes="$root.encrypted_vault_size" />
    <div
      v-if="boxes"
      class="container"
    >
      <div
        class="sidebar"
        :style="{ height: `calc(100vh - ${content_height}px)` }"
      >
        <input
          v-model="search"
          type="text"
          class="search"
          placeholder="search"
        >
        <select
          v-model="sort"
          class="search"
        >
          <option value="created">
            Sort By Date Created
          </option>
          <option value="name">
            Sort By Name
          </option>
        </select>
        <div class="boxes">
          <router-link
            v-for="sorted_box in sorted_boxes"
            :key="sorted_box.uuid"
            :to="{name: 'box', params: {box_uuid: sorted_box.uuid}}"
            class="box_link"
          >
            <div class="aesthetic_rectangle" />
            {{ sorted_box.name }}
            <br>
            <span class="created">{{ sorted_box.created.format('YYYY-MM-DD') }}</span>
          </router-link>
        </div>
        <router-link
          :to="{name: 'add_box'}"
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
import moment from 'moment';
import {type} from 'os';
import PlusBox from '../../img/plus-box.svg';
import {heightMac, heightWin} from '../../consts/title_bar.es6';
import ProgressBar from '../../components/progress_bar.vue';

function sort_box_by_key(key){
  return function(a, b){
    if(a[key] < b[key]) return -1;
    if(a[key] > b[key]) return 1;
    return 0;
  };
}

export default {
  components:{
    PlusBox,
    ProgressBar
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
      if (type() === 'Darwin'){
        return header_bar_height + heightMac;
      }
      return header_bar_height + heightWin;
    },
    sorted_boxes(){
      let sorted_boxes = [];
      for (let key in this.boxes) {
        if (this.boxes.hasOwnProperty(key)) {
          let box = this.boxes[key];
          sorted_boxes.push({
            uuid: key,
            created: moment(box.created),
            name: box.name,
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
  methods: {
    async save(){
      return await this.$root.SaveLocalVault();
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

<style lang="less" scoped>
  .container {
    display: flex; /* or inline-flex */
    flex-direction: row;

    .sidebar {
      background-color: #32373B;
      position: relative;
      flex-grow: 1;
      flex-basis: 0;

      .search {
        margin: 15px 15px 0 15px;
        width: ~'calc(100% - 30px)';
        border-radius: 6px;
        background-color: #080D0E;
        color: white;
        padding: 10px;
        border: none;
        height: 42px;
        font-size: 14px;
      }

      .boxes {
        bottom: 90px;
        right: 0;
        left: 0;
        top: 129px;
        position: absolute;
        overflow-y: auto;

        .box_link {
          color: white;
          padding: 22px;
          display: block;
          text-decoration: none;

          .created {
            color: #72767B;
            font-size: 10px;
          }

          .aesthetic_rectangle {
            float: left;
            height: 26px;
            width: 26px;
            border: 1px solid #979797;
            border-radius: 5px;
            margin-right: 12px;
          }

          &.router-link-active {
            color: #D8A22E;
            /*background-color: #181C1E;*//*color from mocks*/
            background-color: #131617;/*actually matches background*/
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
        background-color: #181C1E;
        border: none;
        font-size: 14px;
        display: block;
        text-decoration: none;
        color: #808080;

        svg{
          margin-right: 16px;
          vertical-align: middle;

          path {
            fill: #808080;
          }
          rect {
            stroke: #808080;
          }
        }

        span{
          line-height: 75px;
        }

        &:hover {
          color: #CE9B2C;
          background-color: #080D0E;

          svg {
            path {
              fill: #CE9B2C;
            }
            rect {
              stroke: #CE9B2C;
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
