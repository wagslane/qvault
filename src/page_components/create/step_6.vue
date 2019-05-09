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
  </div>
</template>

<script>
export default {
  mounted(){
    requestAnimationFrame(async () => {
      requestAnimationFrame(async () => {
        this.open();
      });
    });
  },
  methods:{
    open(){
      try{
        this.$root.NewVaultDialog();
        this.$root.CreateLocalVault();
        this.$router.push({name: 'create_step_7'});
      } catch (err) {
        this.error = err;
      }
    }
  }
};
</script>
