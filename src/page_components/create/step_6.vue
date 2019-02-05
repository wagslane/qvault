<template>
  <div>
    <HeaderBar title="Setup" />
    <StepProgress :filled="6" />
    <form @submit.prevent="create_vault_file">
      <h1>Choose where you'll save your vault file:</h1>
      <button class="btn" @click.prevent="$root.SaveLocalVaultDialog">Choose location</button>
      <h3 v-if="$root.local_vault_path">{{$root.local_vault_path}}</h3>
      <button class="btn" type="submit" v-if="$root.local_vault_path">Next</button>
    </form>
  </div>
</template>

<script>
  import HeaderBar from '../../components/header_bar.vue'
  import StepProgress from '../../components/step_progress.vue'
  export default {
    methods:{
      create_vault_file(){
        this.$root.CreateLocalVault();
        this.$router.push({name: 'create_step_7'});
      },
    },
    components:{
      HeaderBar,
      StepProgress
    }
  }
</script>
