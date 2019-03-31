import '@babel/polyfill';
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueScrollTo from 'vue-scrollto';
import {shell} from 'electron';
 
Vue.use(VueScrollTo);
Vue.use(VueRouter);

import QvaultApp from './qvault.vue';

import HeaderBar from './components/header_bar.vue';
import StepProgress from './components/step_progress.vue';
import TextInput from './components/text_input.vue';
import LoadingOverlay from './components/loading_overlay.vue';

import plus_icon from './img/plus-solid.svg';

Vue.component('HeaderBar', HeaderBar);
Vue.component('StepProgress', StepProgress);
Vue.component('TextInput', TextInput);
Vue.component('LoadingOverlay', LoadingOverlay);
Vue.component('plus_icon', plus_icon);

// Open all http links in external browsers
document.addEventListener('click', function (event) {
  if (event.target.tagName === 'A' && event.target.href.startsWith('http')) {
    event.preventDefault();
    shell.openExternal(event.target.href);
  }
});

window.QvaultApp = new Vue(QvaultApp);
window.QvaultApp.$mount('#qvault');
