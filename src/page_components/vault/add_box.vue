<template>
  <div class="modal">
    <h1>Add Your First Box</h1>
    <p>In QVault, a box is a category of items stored in your vault.</p>
    <div class="buttons">
      <selectable_button
        v-model="type"
        new_value="password"
      >Passwords</selectable_button>
      <div class="bottom">
        <a @click.prevent="add_box">Continue</a>
      </div>
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
        let box_uuid;
        if(this.type==='password'){
          box_uuid = this.$root.CreateBox(
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
        this.$router.push({name: 'box', params: {box_uuid: box_uuid}});
      },
    },
  }
</script>

<style lang="less" scoped>
  .modal {
    margin: 15px;
    text-align: center;
    color: white;
  }
  .buttons {
    .button {
      display: inline-block;
    }
  }
</style>
