import Vue from 'vue';
import VueRouter from 'vue-router';
// import 'babel-polyfill';

import QvaultApp from './qvault.vue';

Vue.use(VueRouter);

window.QvaultApp = new Vue(QvaultApp);
window.QvaultApp.$mount('#qvault');
