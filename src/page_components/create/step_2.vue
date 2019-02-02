<template>
  <div>
    <form @submit.prevent="save_step_2">
      <div v-if="$root.char_key">
        <h2>Write the following characters on your Q-Card:</h2>
        <h3>{{$root.char_key}}</h3>
        <button @click.prevent="$root.GenerateCharKey">Generate a new key</button>
        <button class="btn-primary" type="submit">Next</button>
      </div>
      <div v-else>
        <h2>Generating encryption key, please wait...</h2>
      </div>
    </form>

    <!--<p>Key: {{qrKey}}</p>-->
    <!--<p>Error: {{error}}</p>-->
    <!--<QRScanner @scanned="handleQRKey"  />-->
  </div>
</template>

<script>
  import {GenerateCharKey, ValidateQRKey} from '../../lib/QVaultCrypto/QVaultCrypto';
  import QRScanner from '../../components/qrcode_scanner.vue'

  export default {
    data(){
      return {
        qrKey: '',
        error: ''
      }
    },
    methods:{
      save_step_2(){
        this.$router.push({name: 'create_step_3'});
      },
      handleQRKey: function(qrKey) {
        if (!ValidateQRKey(qrKey)){
          this.error = `Error scanning qrKey: ${qrKey}`;
          return
        }
        this.qrKey = qrKey;
      },
    },
    components:{
      QRScanner
    }
  }
</script>
