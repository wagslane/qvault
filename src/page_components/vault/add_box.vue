<template>
  <div id="add_box" class="modal">
    <h1>Add A Box</h1>
    <p>A box is a group of secrets stored in your vault.</p>
    <div class="buttons">
      <div
        class="button"
        v-on:click="add_box('Passwords')"
      >
        <password_icon></password_icon>
        <br />
        Passwords
      </div>
      <div
        class="button"
        v-on:click="add_box('Cryptocurrency')"
      >
        <crypto_icon></crypto_icon>
        <br />
        Crypto
      </div>
      <div
        class="button"
        v-on:click="add_box('Financial Institution')"
      >
        <fin_icon></fin_icon>
        <br />
        Financial
      </div>
      <br />
      <div
        class="button"
        v-on:click="add_box('Identification')"
      >
        <identity_icon></identity_icon>
        <br />
        Identity
      </div>
      <div
        class="button"
        v-on:click="add_box('Notes')"
      >
        <notes_icon></notes_icon>
        <br />
        Notes
      </div>
      <!--<div-->
        <!--class="button"-->
        <!--v-on:click="add_box('Other')"-->
      <!--&gt;-->
        <!--<other_icon></other_icon>-->
        <!--<br />-->
        <!--Other-->
      <!--</div>-->
    </div>
  </div>
</template>

<script>
  import crypto_icon from '../../img/crypto.svg';
  import fin_icon from '../../img/fin.svg';
  import identity_icon from '../../img/identity.svg';
  import notes_icon from '../../img/notes.svg';
  import other_icon from '../../img/other.svg';
  import password_icon from '../../img/password.svg';

  export default {
    components: {
      crypto_icon,
      fin_icon,
      identity_icon,
      notes_icon,
      other_icon,
      password_icon,
    },
    methods: {
      add_box(type){
        let box_uuid = this.$root.CreateBox(
          type,
          type,
        );
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

          margin-bottom: 13px;
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
