import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

// This vuex store should ONLY store state that needs to be
// reacted upon at a global level. Other global state should be
// stored in singleton components

export const store = new Vuex.Store({
  state: {
    isAppOnline: true
  },
  mutations: {
    setAppOnline(state, isOnline) {
      state.isAppOnline = isOnline;
      if (isOnline){
        window.nodeAPI.electron.ipcRenderer.send('setOnline');
      } else{
        window.nodeAPI.electron.ipcRenderer.send('setOffline');
      }
    }
  },
  getters: {
    isAppOnline: state => state.isAppOnline
  }
});
