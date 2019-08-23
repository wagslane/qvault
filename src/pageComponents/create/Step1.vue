<template>
  <div>
    <HeaderBar title="Setup" />
    <div class="options-box">
      <div class="body center-text">
        <StepProgress :filled="1" />
        <h1>Key Backup</h1>
        <h2>
          <a
            href="https://qvault.io"
            class="link"
          >Will you use Qvault cards?</a>
        </h2>

        <h3>
          Qvault cards are physical plastic cards which allow you to dual encrypt your vault 
          as well as setup a recovery code in case you forget your password.
        </h3>

        <router-link
          class="btn"
          :to="{name: 'CreateStep2'}"
        >
          Yes, use my Qvault cards
        </router-link>

        <router-link
          class="link"
          :to="{name: 'CreateStep4'}"
        >
          Skip for now
        </router-link>
      </div>

      <div class="footer">
        <div
          class="back"
          @click="$router.go(-1)"
        >
          <div class="icon" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {GenerateCharKey} from '../../lib/QVaultCrypto/QVaultCrypto';

export default {
  mounted(){
    // We need to set the char key here in case the user
    // skips the recovery card step
    this.$root.char_key = GenerateCharKey();
  }
};
</script>
