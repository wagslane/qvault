<template>
  <div>
    <div class="sidebar">
      <input
        type="text"
        placeholder="search"
      >
      <router-link
        v-for="(secret, uuid) in secrets"
        :key="uuid"
        :to="{name: 'vault_item', params: {secret_uuid: uuid}}"
      >
        {{secret.name}}
      </router-link>
      <button></button>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>
