<template>
  <div>
    <ToggleSwitch v-model="online" />
    <transition name="fade">
      <p v-if="show">
        {{ onlineText }}
      </p>
    </transition>
  </div>
</template>

<script>
import ToggleSwitch from './ToggleSwitch.vue';
import { internetAvailable } from '../lib/cloudClient';
import sleep from '../lib/sleep';
import { getPreferenceFromFile } from '../lib/appPreferences';

export default {
  components:{
    ToggleSwitch,
  },
  data() {
    return {
      show: false
    };
  },
  computed:{
    online: {
      get () {
        return this.$store.getters.isAppOnline;
      },
      set (value) {
        this.$store.commit('setAppOnline', value);
      }
    },
    onlineText(){
      return this.$store.getters.isAppOnline ? 'Online' : 'Offline';
    }
  },
  watch:{
    online: async function (isNowOnline) {
      if (isNowOnline){
        // allow the main process to unblock connection
        // in order to check for connection
        await sleep(10);
        if (!await internetAvailable()){
          // force offine if we have no connection
          this.$store.commit('setAppOnline', false);
          return;
        }
      }

      this.show = true;
      await sleep(100);
      this.show = false;
    }
  },
  async beforeCreate(){
    // show we are offine if we have no connection
    if(!await internetAvailable() || !getPreferenceFromFile('onlineMode')){
      this.$store.commit('setAppOnline', false);
    }
  }
};
</script>

<style lang="less" scoped>
  @import '../styles/z_indices.less';

  .fade-leave-active {
    transition: opacity 2s;
  }

  .fade-leave-to {
    opacity: 0;
  }

  p{
    font-size: 18px;
    position: absolute;
    z-index: @zMax;
    margin-top: 5px;
    margin-left: 5px;
  }
</style>
