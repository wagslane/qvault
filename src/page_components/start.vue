<template>
  <div>
    <h1>Open a Vault or create a new one?</h1>
    <router-link :to="{name: 'create_step_1'}">New</router-link>
    <router-link :to="{name: 'load_local'}">Load from local</router-link>
    <router-link :to="{name: 'load_cloud'}">Load from cloud</router-link>
  </div>
</template>
