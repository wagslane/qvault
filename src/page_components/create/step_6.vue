<template>
  <div>
    <HeaderBar title="Setup" />
    <div class="options-box">
      <div class="body">
        <StepProgress :filled="5" />
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
    <timingOverlay
      ref="loader"
    />
  </div>
</template>

<script>
import timingOverlay from '../../components/timingOverlay.vue';

export default {
  components:{
    timingOverlay
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
      this.$router.push({name: 'create_step_7'});
    }
  }
};
</script>
