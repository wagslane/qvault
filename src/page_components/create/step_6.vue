<template>
  <div>
    <HeaderBar title="Setup" />
    <div class="options-box">
      <form @submit.prevent="create_vault_file">
        <div class="body">
          <StepProgress :filled="6" />
            <h1>Choose where you'll save your vault file:</h1>
            <button class="btn" @click.prevent="$root.SaveLocalVaultDialog">Choose location</button>
            <h3 v-if="$root.local_vault_path">{{$root.local_vault_path}}</h3>
        </div>
        <div class="footer">
          <div class="back" @click="$router.go(-1)" />
          <button
                class="continue"
                type="submit"
                v-if="$root.local_vault_path"
              >
              <span>Continue</span>
              <div class="continue-arrow" />
            </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  export default {
    methods:{
      create_vault_file(){
        this.$root.CreateLocalVault();
        this.$router.push({name: 'create_step_7'});
      },
    },
  }
</script>
