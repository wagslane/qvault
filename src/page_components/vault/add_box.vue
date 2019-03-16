<template>
  <div id="add_box" class="modal">
    <h1>Add A Box</h1>
    <p>A box is a group of secrets stored in your vault.</p>
    <div class="buttons">
      <div
        class="button"
        v-on:click="add_box('password')"
      >
        <password_icon></password_icon>
        Passwords
      </div>
    </div>
  </div>
</template>

<script>
  import password_icon from '../../img/password.svg';

  export default {
    components: {
      password_icon,
    },
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

<style lang="less">
  #add_box {
    &.modal {
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
        border: 1px solid #42454A;

        svg {
          width: 28px;
          height: 28px;

          path {
            fill: #999B9C;
          }
          rect {
            stroke: #999B9C;
          }
        }

        &:hover {
          color: #CE9B2C;
          background-color: #080D0E;
          border: 1px solid #CE9B2C;

          svg {
            path {
              fill: #CE9B2C;
            }
            rect {
              stroke: #CE9B2C;
            }
          }
        }
      }
    }
  }
</style>
