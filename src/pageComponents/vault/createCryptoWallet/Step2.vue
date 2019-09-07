<template>
  <div>
    <div class="options-box">
      <div class="body">
        <h1>Mnemonic Seed</h1>
        <p>
          The seed below is the key to all funds that will be stored in this wallet.
        </p>
        <p>
          If you don't keep multiple copies of this vault, or if you don't have a 
          <a
            href="https://qvault.io"
            class="link"
          >Qvault Recovery Card</a>
          setup, then we stongly recommend writing this seed down on paper and keeping it in a safe place.
        </p>
        <div
          class="btn"
          @click="$refs.viewSeed.show()"
        >
          View Seed
        </div>
      </div>
      <div class="footer">
        <div
          class="back"
          @click="$router.go(-1)"
        >
          <div class="icon" />
        </div>
        <div
          @click="$router.push({
            name: 'VaultCreateCryptoWalletStep3', 
            params: {seed, boxUUID: $route.params.boxUUID}
          });"
        >
          <button class="continue">
            <span>Continue</span>
            <div class="continue-arrow" />
          </button>
        </div>
      </div>
    </div>
    <AlertMessage
      ref="viewSeed"
      :content="seed"
    />
  </div>
</template>

<script>
import { generateMnemonic } from '../../../lib/qvaultBitcoin';
import AlertMessage from '../../../components/AlertMessage.vue';

export default {
  components:{
    AlertMessage
  },
  data(){
    return{
      seed: null
    };
  },
  created(){
    this.seed = generateMnemonic();
  },
};
</script>

<style lang="less">
  @import '../../../styles/colors.less';

  p{
    color: #fff;
  }
</style>
