import '@babel/polyfill';
import Vue from 'vue';
import VueRouter from 'vue-router';
 
Vue.use(VueRouter);

import QvaultApp from './qvault.vue';

import HeaderBar from './components/headerBar.vue';
import StepProgress from './components/stepProgress.vue';
import DecoratedTextInput from './components/decoratedTextInput.vue';

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

window.QvaultApp = new Vue(QvaultApp);
window.QvaultApp.$mount('#qvault');
