<template>
  <div class="modal">
    <h1>Add Your First Box</h1>
    <p>In QVault, a box is a category of items stored in your vault.</p>
    <div class="buttons">
      <selectable_button
        v-model="type"
        new_value="password"
      >Passwords</selectable_button>
    </div>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        type: 'password',
      }
    },
    methods: {
      add_box(){
        if(this.type==='password'){
          $root.CreateBox(
            'Passwords',
            [
              'Issuer (Website, Wifi, Device)',
              '2FA Secret',
              'Password',
              'Username',
              'Email',
              'Link',
              'Notes',
            ]
          )
        }
      },
    },
  }
</script>

<style lang="less" scoped>
  .buttons {
  }
</style>
