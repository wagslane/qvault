<template>
  <div>
    <HeaderBar title="Vault" fixed/>
    <div class="container" v-if="boxes">
      <div class="sidebar">
        <input
          type="text"
          class="search"
          placeholder="search"
          v-model="search"
        >
        <select
          class="search"
          v-model="sort"
        >
          <option value="created">Sort By Date Created</option>
          <option value="name">Sort By Name</option>
        </select>
        <div class="boxes">
          <router-link
            v-for="sorted_box in sorted_boxes"
            :key="sorted_box.uuid"
            :to="{name: 'box', params: {box_uuid: sorted_box.uuid}}"
            class="box_link"
          >
            <div class="aesthetic_rectangle"></div>
            {{sorted_box.name}}
            <br />
            <span class="created">{{sorted_box.created.format('YYYY-MM-DD')}}</span>
          </router-link>
        </div>
        <router-link
          :to="{name: 'add_box'}"
          class="add_box"
        >
          <img src="../../img/plus-solid.svg" style="height: 22px" />
        </router-link>
      </div>
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment';

  function sort_box_by_key(key){
    return function(a, b){
      if(a[key] < b[key]) return -1;
      if(a[key] > b[key]) return 1;
      return 0;
    }
  }

  export default {
    data(){
      return {
        'sort': 'name',
        'search': null,
      }
    },
    computed: {
      boxes(){
        return this.$root.secrets;
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
          )
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
  }
</script>

<style lang="less" scoped>
  .container {
    display: flex; /* or inline-flex */
    flex-direction: row;

    .sidebar {
      width: 25%;
      background-color: #32373B;
      height: ~'calc(100vh - 55px)';
      position: fixed;
      margin-top: 55px;

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
        height: ~'calc(100vh - 274px)';
        overflow-y: auto;
        margin-top: 15px;
        margin-bottom: 15px;

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

          &:nth-child(2n){
            background-color: #252A2D;
          }
        }
      }

      .add_box {
        width: 100%;
        height: 75px;
        text-align: center;
        bottom: 100%;
        background-color: #181C1E;
        color: white;
        border: none;
        font-size: 35px;
        display: block;
        line-height: 70px;
      }
    }

    .content {
      margin-top: 55px;
      margin-left: 25%;
      width: 75%;
      max-height: ~'calc(100vh - 55px)';
      overflow-y: scroll;
    }
  }
</style>
