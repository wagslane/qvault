import Vue from 'vue';
import Vuex from 'vuex';
import {writeToPreferenceFile} from '../lib/appPreferences';

Vue.use(Vuex);

// This vuex store should ONLY store state that needs to be
// reacted upon at a global level. Other global state should be
// stored in singleton components

export const store = new Vuex.Store({
  state: {
    isAppOnline: true,
    conflicts: []
  },
  mutations: {
    setAppOnline(state, isOnline) {
      state.isAppOnline = isOnline;
      if (isOnline){
        window.nodeAPI.electron.ipcRenderer.send('setOnline');
        writeToPreferenceFile('onlineMode',true);
      } else{
        window.nodeAPI.electron.ipcRenderer.send('setOffline');
        writeToPreferenceFile('onlineMode',false);
      }
    },
    pushConflict(state, newConflict){
      state.conflicts.push(newConflict);
    },
    popConflict(state){
      state.conflicts.shift();
    }
  },
  getters: {
    isAppOnline: state => state.isAppOnline,
    getNextConflict: state => state.conflicts.length > 0 ? state.conflicts[0] : null
  }
});
