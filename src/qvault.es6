import '@babel/polyfill';
import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import QvaultApp from './qvault.vue';

import HeaderBar from './components/header_bar.vue';
import StepProgress from './components/step_progress.vue';
import VirtualKeyboard from './components/virtual_keyboard.vue';

Vue.component('HeaderBar', HeaderBar);
Vue.component('StepProgress', StepProgress);
Vue.component('VirtualKeyboard', VirtualKeyboard);

window.QvaultApp = new Vue(QvaultApp);
window.QvaultApp.$mount('#qvault');
