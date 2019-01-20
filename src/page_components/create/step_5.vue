<template>
  <div>
    <h1>Would you like us to keep a back-up of your encrypted vault?</h1>
    <router-link :to="{name: 'create_step_5'}">Yes</router-link>
    <router-link :to="{name: 'vault'}">No</router-link>
  </div>
</template>
