<template>
  <div>
    <div class="options-box">
      <form @submit.prevent="clickContinue">
        <div class="body">
          <h1>Extended Public Keys</h1>
          <p>
            The keys below can be imported into a watch-only wallet in order to create
            addresses and view balances.
          </p>
          <p>
            We recommend
            <a
              href="https://samouraiwallet.com/sentinel"
              class="link"
            >Samourai's Sentinel</a>
            or 
            <a
              href="http://docs.electrum.org/en/latest/coldstorage.html?highlight=watch%20only#create-a-watching-only-version-of-your-wallet"
              class="link"
            >Electrum.</a>
          </p>
          <p>
            If an attacker gains access to one of these public keys they can't steal funds, but all anonymity
            for this wallet will be lost.
          </p>
          <div
            class="btn"
            @click="$refs.viewXPub.show()"
          >
            View Xpub - Legacy
          </div>
          <div
            class="btn"
            @click="$refs.viewYPub.show()"
          >
            View Ypub - Backwards Compatible Segwit
          </div>
          <div
            class="btn"
            @click="$refs.viewZPub.show()"
          >
            View Zpub - Pure Segwit
          </div>
          <DecoratedTextInput
            v-model="walletName" 
            keyboard-id="walletName" 
            description="Wallet Name"
            type="text"
          />
          <span
            v-if="err"
            class="form-error"
          >{{ err }}</span>
        </div>
        <div class="footer">
          <div
            class="back"
            @click="$router.go(-1)"
          >
            <div class="icon" />
          </div>
          <button
            type="submit"
            class="continue"
          >
            <span>Continue</span>
            <div class="continue-arrow" />
          </button>
        </div>
      </form>
    </div>
    <AlertMessage
      ref="viewXPub"
      :content="xpub"
      :qr-value="xpub"
    />
    <AlertMessage
      ref="viewYPub"
      :content="ypub"
      :qr-value="ypub"
    />
    <AlertMessage
      ref="viewZPub"
      :content="zpub"
      :qr-value="zpub"
    />
    <TimingOverlay
      ref="loader"
    />
    <TimingOverlay
      ref="successOverlay"
      overlay-screen="success"
      title="Vault Saved"
    />
  </div>
</template>

<script>
import { mnemonicToXPub, mnemonicToYPub, mnemonicToZPub } from '../../../lib/qvaultBitcoin';
import AlertMessage from '../../../components/AlertMessage.vue';
import TimingOverlay from '../../../components/TimingOverlay.vue';

export default {
  components:{
    AlertMessage,
    TimingOverlay
  },
  data(){
    return {
      walletName: '',
      err: null,
      xpub: null,
      ypub: null,
      zpub: null
    };
  },
  async mounted(){
    this.xpub = await mnemonicToXPub(this.$route.params.seed, 0);
    this.ypub = await mnemonicToYPub(this.$route.params.seed, 0);
    this.zpub = await mnemonicToZPub(this.$route.params.seed, 0);
  },
  methods:{
    async save(){
      await this.$root.SaveBoth();
    },
    async clickContinue(){
      if (this.walletName.length < 1){
        this.err = 'Please enter a wallet name';
        return;
      }
      const newSecret = {
        fields:{
          'Wallet Name': this.walletName,
          'Ticker': 'BTC',
          'Seed': this.$route.params.seed
        }
      };
      const secretUUID = this.$root.CreateSecret(this.$route.params.boxUUID, newSecret);
      try{
        await this.$refs.loader.load(this.save);
      } catch (err){
        this.err = err;
        return;
      }
      await this.$refs.successOverlay.sleep(1200);
      this.$router.push({name: 'Secret', params: {
        boxUUID: this.$route.params.boxUUID, 
        secretUUID
      }});
    }
  }
};
</script>

<style lang="less">
  @import '../../../styles/colors.less';

  p{
    color: #fff;
  }
</style>
