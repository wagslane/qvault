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
  import fs from 'fs';

  export default {
    data(){
      return {
        filename: null,
      }
    },
    methods:{
      choose_location_dialogue(){
        dialog.showSaveDialog(
          {
            filters: [{
              name: 'Q-Vault archive',
              extensions: ['qvault']
            }],
          },
          this.save_callback
        )
      },
      save_callback(filename, bookmark){
        this.filename = filename;
      },
      create_vault_file(){
        fs.writeFile(this.filename, JSON.stringify({test: 'data'}), this.write_callback);
      },
      write_callback(err){
        if(err){
          alert("An error ocurred creating the file "+ err.message)
        } else {
          this.$router.push({name: 'create_step_5'});
        }
      },
    },
  }
</script>
