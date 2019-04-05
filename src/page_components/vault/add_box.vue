<template>
  <div
    id="add_box"
    class="modal"
  >
    <h1>Add A Box</h1>
    <p>A box is a group of secrets stored in your vault.</p>
    <div class="buttons">
      <div
        class="button"
        @click="add_box('Passwords')"
      >
        <password_icon />
        <br>
        Passwords
      </div>
      <div
        class="button"
        @click="add_box('Cryptocurrency')"
      >
        <crypto_icon />
        <br>
        Crypto
      </div>
      <div
        class="button"
        @click="add_box('Financial Institution')"
      >
        <fin_icon />
        <br>
        Financial
      </div>
      <br>
      <div
        class="button"
        @click="add_box('Identification')"
      >
        <identity_icon />
        <br>
        Identity
      </div>
      <div
        class="button"
        @click="add_box('Notes')"
      >
        <notes_icon />
        <br>
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
import password_icon from '../../img/password.svg';

export default {
  components: {
    crypto_icon,
    fin_icon,
    identity_icon,
    notes_icon,
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
};
</script>

<style lang="less" scoped>
  @import '../../styles/colors.less';

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
        color: @gray-lighter;
        background-color: @black-lightest;
        margin: 20px;
        padding: 25px;
        cursor: pointer;
        border: 1px solid @black-lightest;

        svg {
          width: 28px;
          height: 28px;

          path {
            fill: @gray-lighter;
          }
          rect {
            stroke: @gray-lighter;
          }

          margin-bottom: 13px;
        }

        &:hover {
          color: @gold-dark;
          background-color: @black-darkest;
          border: 1px solid @gold-dark;

          svg {
            path {
              fill: @gold-dark;
            }
            rect {
              stroke: @gold-dark;
            }
          }
        }
      }
    }
  }
</style>
