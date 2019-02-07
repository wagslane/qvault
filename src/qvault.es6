import '@babel/polyfill';
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueClipboard from 'vue-clipboard2';

Vue.use(VueRouter);
Vue.use(VueClipboard);

import QvaultApp from './qvault.vue';

import HeaderBar from './components/header_bar.vue';
import StepProgress from './components/step_progress.vue';

Vue.component('HeaderBar', HeaderBar);
Vue.component('StepProgress', StepProgress);

window.QvaultApp = new Vue(QvaultApp);
window.QvaultApp.$mount('#qvault');
