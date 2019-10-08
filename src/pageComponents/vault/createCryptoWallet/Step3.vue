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
            We recommend:
          </p>
          <ul
            v-for="(recommendation, i) in recommendations"
            :key="i"
          >
            <a
              :href="recommendation.link"
              class="link"
            >{{ recommendation.title }}</a>
          </ul>
          <p>
            If an attacker gains access to these public keys, funds are still safe but all anonymity
            for this wallet will be lost.
          </p>
          <SelectDropdown
            :options="optionsDisplayNames"
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
            <span>Create and Save</span>
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
import { 
  mnemonicToXPubBTC,
  mnemonicToYPubBTC,
  mnemonicToZPubBTC,
  mnemonicToXPubBCH,
} from '../../../lib/qvaultBitcoin';
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
      xpubBTC: null,
      ypubBTC: null,
      zpubBTC: null,
      xpubBCH: null,
      selection: null
    };
  },
  computed:{
    recommendations(){
      if (this.$route.params.ticker == 'BTC'){
        return [
          {
            title: "Samourai's Sentinel",
            link: 'https://samouraiwallet.com/sentinel'
          },
          {
            title: 'Electrum',
            link: 'http://docs.electrum.org/en/latest/coldstorage.html?highlight=watch%20only#create-a-watching-only-version-of-your-wallet'
          },
        ];
      }
      if (this.$route.params.ticker == 'BCH'){
        return [
          {
            title: 'Electron Cash',
            link: 'https://electroncash.org/'
          },
        ];
      }
      return [];
    },
    options(){
      if (this.$route.params.ticker == 'BTC'){
        return [ 
          {
            displayName: 'View Xpub',
            val: this.xpubBTC,
          },
          {
            displayName: 'View Ypub',
            val: this.ypubBTC,
          },
          {
            displayName: 'View Zpub',
            val: this.zpubBTC,
          }
        ];
      }
      if (this.$route.params.ticker == 'BCH'){
        return [ 
          {
            displayName: 'View Xpub',
            val: this.xpubBCH,
          },
        ];
      }
      return [];
    },
    optionsDisplayNames(){
      return this.options.map(option => option.displayName);
    },
    qrValue(){
      if (!this.selection){
        return '';
      }
      return this.options.find((option) => option.displayName === this.selection).val;
    }
  },
  async mounted(){
    this.xpubBTC = await mnemonicToXPubBTC(this.$route.params.seed, 0);
    this.ypubBTC = await mnemonicToYPubBTC(this.$route.params.seed, 0);
    this.zpubBTC = await mnemonicToZPubBTC(this.$route.params.seed, 0);
    this.xpubBCH = await mnemonicToXPubBCH(this.$route.params.seed, 0);
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
          'walletName': this.walletName,
          'ticker': this.$route.params.ticker,
          'seed': this.$route.params.seed
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
