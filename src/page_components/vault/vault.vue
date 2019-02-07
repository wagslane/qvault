<template>
  <div class="container">
    <div class="sidebar">
      <input
        type="text"
        class="search"
        placeholder="search"
      >
      <router-link
        v-for="(box, uuid) in $root.secrets"
        :key="uuid"
        :to="{name: 'vault_item', params: {box_uuid: uuid}}"
      >
        {{box.name}}
      </router-link>
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
