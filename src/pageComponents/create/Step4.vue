<template>
  <div>
    <HeaderBar title="Setup" />
    <div class="options-box">
      <div class="body">
        <StepProgress :filled="4" />
        <h1>Choose where to save your vault file</h1>
        <button
          class="btn"
          @click.prevent="open"
        >
          Choose location
        </button>
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
    <TimingOverlay
      ref="loader"
    />
  </div>
</template>

<script>
import TimingOverlay from '../../components/TimingOverlay.vue';

export default {
  components:{
    TimingOverlay
  },
  mounted(){
    requestAnimationFrame(async () => {
      requestAnimationFrame(async () => {
        this.open();
      });
    });
  },
  methods:{
    async open(){
      try{
        this.$root.NewVaultDialog();
        await this.$refs.loader.load(this.$root.CreateLocalVault);
      } catch (err) {
        this.error = err;
      }
      if (this.$store.getters.isAppOnline){
        this.$router.push({name: 'CreateStep5'});
      } else {
        this.$router.push({name: 'Vault'});
      }
    }
  }
};
</script>
