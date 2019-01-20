<template>
  <form @submit.prevent="create_account">
    <input type="email" v-model="email" placeholder="email" />
    <input type="text" v-model="name" placeholder="name" />
    <button type="submit">Create</button>
  </form>
</template>
