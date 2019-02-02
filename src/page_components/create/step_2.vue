<template>
  <div class="options-box">
    <h1>Create a Qcard backup</h1>
    <h2>Backup your vault for safekeeping</h2>
    <form @submit.prevent="save_step_2">

      <div v-if="$root.char_key">
        <div class='highlight-box'>
          <h3>Write the following characters on your Q-Card:</h3>
          <div class='character-code'>
            <div class= 'spacing'>
              <span>{{$root.char_key}}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-else>
        <h2>Generating encryption key, please wait...</h2>
      </div>
    </form>

    <h2>Would you like to require that your QR Code is scanned each time you unlock the vault?</h2>

    <router-link class="btn" :to="{name: 'create_step_2_5'}">
      Yes
    </router-link>

    <router-link class="btn" :to="{name: 'create_step_3'}">
      No (Less Secure)
    </router-link>
  </div>
</template>

<script>
  import {GenerateCharKey} from '../../lib/QVaultCrypto/QVaultCrypto';

  export default {
    mounted(){
      this.generate_key();
    },
    methods:{
      async generate_key(){
        this.$root.char_key = await GenerateCharKey();
      },
    },
  }
</script>
