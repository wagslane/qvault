<template>
  <form>

  </form>
</template>

<script>
  export default {
    computed: {
      uuid(){ return this.$route.params.secret_uuid; },
      secret(){
        if(this.$root.secrets && this.uuid){
          return this.$root.secrets[this.uuid];
        }
      },
    }
  }
</script>
