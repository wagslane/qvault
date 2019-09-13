<template>
  <div>
    <div class="options-box">
      <form @submit.prevent="clickContinue">
        <div class="body">
          <h1>Extended Public Keys</h1>
          <p>
            The public keys below can be imported into a watch-only wallet in order to create
            new addresses and view balances.
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
            If an attacker gains access to these public keys, funds are still safe but all anonymity
            for this wallet will be lost.
          </p>
          <SelectDropdown
            :options="options"
            @input="selection = $event"
          />
          <div class="qrWrapper">
            <QrcodeViewer
              v-if="qrValue"
              :value="qrValue"
              class="qrcode"
            />
            <div class="qrText">
              {{ qrValue }}
            </div>
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
import TimingOverlay from '../../../components/TimingOverlay.vue';
import SelectDropdown from '../../../components/SelectDropdown.vue';
import QrcodeViewer from '../../../components/QrcodeViewer.vue';

export default {
  components:{
    TimingOverlay,
    SelectDropdown,
    QrcodeViewer
  },
  data(){
    return {
      walletName: '',
      err: null,
      xpub: null,
      ypub: null,
      zpub: null,
      options: [ 'View Xpub', 'View Ypub', 'View Zpub' ],
      selection: null
    };
  },
  computed:{
    qrValue(){
      if(this.options.length !== 3){
        return '';
      }
      if (this.selection === this.options[0]){
        return this.xpub;
      }
      if (this.selection === this.options[1]){
        return this.ypub;
      }
      return this.zpub;
    }
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
          'Ticker': this.$route.params.ticker,
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

  .qrWrapper{
    text-align: center;
    margin-top: 15px;
    margin-bottom: 15px;
    overflow-wrap: break-word;
    color: #fff;

    .qrText{
      margin-top: 10px;
    }
  }
</style>
