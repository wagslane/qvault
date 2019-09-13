<template>
  <div>
    <div class="options-box">
      <div class="body">
        <h1>Generate a Cold Crypto Wallet</h1>
        <p>
          Your new wallet will <b>not have the ability to send coins</b> using Qvault directly. 
          Instead, this is a <b>savings account</b> that is effectively offline, and can 
          be brought online by importing the seed into the <b>hot wallet</b> software of your choice.
        </p>
        <p>
          While there is nothing wrong with creating this wallet while your computer has an internet connection,
          for maximum security you may consider using an offline and secure device to generate wallets.
        </p>
        <SelectDropdown
          :options="['BTC']"
          @input="ticker = $event"
        />
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
            name: 'VaultCreateCryptoWalletStep2', 
            params: {boxUUID: $route.params.boxUUID, ticker} 
          });"
        >
          <button class="continue">
            <span>Continue</span>
            <div class="continue-arrow" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SelectDropdown from '../../../components/SelectDropdown.vue';

export default {
  components:{
    SelectDropdown
  },
  data(){
    return {
      ticker: null
    };
  }
};
</script>

<style lang="less">
  @import '../../../styles/colors.less';

  p{
    color: #fff;
  }
</style>
