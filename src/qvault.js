import '@babel/polyfill';
import Vue from 'vue';
import VueRouter from 'vue-router';
 
Vue.use(VueRouter);

import App from './App.vue';

import HeaderBar from './components/HeaderBar.vue';
import StepProgress from './components/StepProgress.vue';
import DecoratedTextInput from './components/DecoratedTextInput.vue';

Vue.component('HeaderBar', HeaderBar);
Vue.component('StepProgress', StepProgress);
Vue.component('DecoratedTextInput', DecoratedTextInput);

// Open all http links in external browsers
document.addEventListener('click', function (event) {
  if (event.target.tagName === 'A' && event.target.href.startsWith('http')) {
    event.preventDefault();
    window.nodeAPI.electron.shell.openExternal(event.target.href);
  }
});

window.App = new Vue(App);
window.App.$mount('#qvault');
