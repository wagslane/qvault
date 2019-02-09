<template>
  <div class="container">
    <div class="sidebar" v-if="$root.secrets">
      <input
        type="text"
        class="search"
        placeholder="search"
      >
      <div class="boxes">
        <router-link
          v-for="(box, uuid) in $root.secrets"
          :key="uuid"
          :to="{name: 'vault_item', params: {secret_uuid: uuid}}"
          class="box_link"
        >
          {{box.name}}
        </router-link>
      </div>
      <button
        @click.prevent="add_box"
        class="add_box"
      >Add</button>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import moment from 'moment';

  export default {
    methods: {
      add_box(){
        let uuid = this.$root.CreateSecret({
          name: 'Name',
          secrets: [],
          created: moment().format('YYYY-MM-DD'),
        });
        this.$router.push({name: 'vault_item', params: {secret_uuid: uuid}});
      }
    },
  }
</script>

<style lang="less" scoped>
  .container {
    display: flex; /* or inline-flex */
    flex-direction: row;
    height: 100vh;

    .sidebar {
      width: 25%;
      padding: 15px;
      background-color: #32373B;
      height: 100vh;
    }

    .content {
      width: 75%;
    }
  }

  .boxes {
    height: ~'calc(100vh - 174px)';
    overflow-y: auto;
    margin-top: 15px;
    margin-bottom: 15px;

    .box_link {
      color: white;
      padding: 22px;
      display: block;

      &.router-link-active {
        color: #D8A22E;
      }

      &:nth-child(2n){
        background-color: #181C1E;
      }
    }
  }

  .search {
    width: 100%;
    border-radius: 6px;
    background-color: #080D0E;
    color: white;
    padding: 10px;
  }

  .add_box {
    width: 100%;
    height: 75px;
    text-align: center;
    bottom: 100%;
    background-color: #181C1E;
    color: white;
  }
</style>
