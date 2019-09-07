<template>
  <div>
    <div class="options-box">
      <div class="body">
        <h1>Generate a New Crypto Wallet</h1>
        <p>
          By continuing you will create a new seed, which is a secret list of words that allows coins to be spent. Along with 
          the seed, associated extended public keys will be created.
        </p>
        <p>
          By importing an extended public key (either an XPub, YPub, or ZPub) into a watch only wallet like
          <a
            href="https://samouraiwallet.com/sentinel"
            class="link"
          >Samourai's Sentinel</a>
          or 
          <a
            href="http://docs.electrum.org/en/latest/coldstorage.html?highlight=watch%20only#create-a-watching-only-version-of-your-wallet"
            class="link"
          >Electrum,</a>
          you will be able to generate new addresses and view balances without exposing the secret
          seed.
        </p>
        <p>
          Once you are ready to spend the coins that have been accumulated in your watch-only wallet, 
          you will import the seed into a normal wallet. For this reason, watch-only wallets are more
          secure and can be thought of as a savings account.
        </p>
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
            params: {boxUUID: $route.params.boxUUID} 
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

<style lang="less">
  @import '../../../styles/colors.less';

  p{
    color: #fff;
  }
</style>
