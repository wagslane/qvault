<template>
  <div>
    <HeaderBar title="Setup" />
    <StepProgress :filled="8" />
    <form @submit.prevent="create_account">
      <TextInput
          v-model="email" 
          keyboardID="email" 
          description="Email" 
          type="email"/>
      <button type="submit">Create</button>
    </form>
  </div>
</template>

<script>
  export default {
  }
</script>
