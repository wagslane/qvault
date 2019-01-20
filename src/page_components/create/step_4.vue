<template>
  <form @submit.prevent="create_vault_file">
    <h2>Choose where you'll save your vault file:</h2>
    <button @click.prevent="choose_location_dialogue">Choose location</button>
    <div v-if="filename">{{filename}}</div>
    <button type="submit" v-if="filename">Next</button>
  </form>
</template>

<script>
  const { dialog } = require('electron').remote;

  export default {
    data(){
      return {
        filename: null,
      }
    },
    methods:{
      choose_location_dialogue(){
        dialog.showSaveDialog({}, this.save_callback)
      },
      save_callback(filename, bookmark){
        this.filename = filename;
      },
      create_vault_file(){
        //TODO: actually create the file
        this.$router.push({name: 'create_step_5'});
      },
    }
  }
</script>
