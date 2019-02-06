<template>
  <div>
    <HeaderBar title="Setup" />
    <StepProgress :filled="8" />
    <form @submit.prevent="create_account">
      <input type="email" v-model="email" placeholder="email" />
      <button type="submit">Create</button>
    </form>
  </div>
</template>

<script>
  export default {
  }
</script>
