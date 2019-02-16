<template>
  <div class="container" v-if="boxes">
    <div class="sidebar">
      <input
        type="text"
        class="search"
        placeholder="search"
      >
      <div class="boxes">
        <router-link
          v-for="(box, box_uuid) in boxes"
          :key="box_uuid"
          :to="{name: 'vault_item', params: {box_uuid}}"
          class="box_link"
        >
          <div class="aesthetic_rectangle"></div>
          {{box.name}}
        </router-link>
      </div>
      <button
        @click.prevent="CreateBox"
        class="add_box"
      >+</button>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
    <button @click.prevent="save">Save</button>
  </div>
</template>

<script>
  export default {
    computed: {
      boxes(){
        return this.$root.secrets;
      },
    },
    methods: {
      CreateBox(){
        let uuid = this.$root.CreateBox();
        this.$router.push({name: 'vault_item', params: {box_uuid: uuid}});
      },
      async save(){
        return await this.$root.SaveLocalVault();
      },
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
      background-color: #32373B;
      height: 100vh;

      .search {
        margin: 15px;
        width: calc(100% - 30px);
        border-radius: 6px;
        background-color: #080D0E;
        color: white;
        padding: 10px;
        border: none;
        height: 42px;
        font-size: 14px;
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
          text-decoration: none;

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
      }
    }

    .content {
      width: 75%;
    }
  }
</style>
