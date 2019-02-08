<template>
  <div>
    <HeaderBar title="Setup" />
    <div class="options-box">
      <div class="body">
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
      <div class="footer">
        <div class="back" @click="$router.go(-1)" />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
  }
</script>
