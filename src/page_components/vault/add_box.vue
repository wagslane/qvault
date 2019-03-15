<template>
  <div class="modal">
    <h1>Add A Box</h1>
    <p>A box is a group of secrets stored in your vault.</p>
    <div class="buttons">
      <div
        class="button"
        v-on:click="add_box('password')"
      >
        Passwords
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    methods: {
      add_box(type){
        let box_uuid;
        if(type === 'password'){
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
      height: 110px;
      width: 140px;
      border-radius: 9px;
      text-align: center;
      font-size: 14px;
      color: #999B9C;
      background-color: #42454A;
      margin: 20px;
      padding: 25px;
      cursor: pointer;

      &:hover {
        color: #CE9B2C;
        background-color: #080D0E;
        border: 1px solid #CE9B2C;
      }
    }
  }
</style>
