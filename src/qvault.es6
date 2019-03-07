import '@babel/polyfill';
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueScrollTo from 'vue-scrollto';
 
Vue.use(VueScrollTo);
Vue.use(VueRouter);

import QvaultApp from './qvault.vue';

import HeaderBar from './components/header_bar.vue';
import StepProgress from './components/step_progress.vue';
import TextInput from './components/text_input.vue';
import selectable_button from './components/selectable_button.vue';

Vue.component('HeaderBar', HeaderBar);
Vue.component('StepProgress', StepProgress);
Vue.component('TextInput', TextInput);
Vue.component('selectable_button', selectable_button);

window.QvaultApp = new Vue(QvaultApp);
window.QvaultApp.$mount('#qvault');
