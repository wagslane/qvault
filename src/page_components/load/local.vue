<template>
  <form @submit.prevent="open">
    <HeaderBar title="Setup" />
    <div class="options-box">
      <h1>Unlock Vault</h1>
      <button
        @click.prevent="$root.OpenLocalVault"
        class="btn"
      >
        Choose Vault File
      </button>
      <div>{{$root.local_vault_path}}</div>
      <div class="input-field">
        <div class="description">Password</div>
        <input
          class="text"
          type="password"
          v-model="password"
          required
        />
      </div>
      <button
        type="submit"
        v-if="!($root.local_vault_path && password)"
        class="btn"
      >Open</button>
    </div>
  </form>
</template>

<script>
  export default {
    data(){
      return {
        password: null,
      }
    },
    methods: {
      async open(){
        await this.$root.LoadLocalVault(this.password);
        this.$router.push({name: 'vault'});
      },
    },
  }
</script>
