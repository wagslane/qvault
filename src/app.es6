import Vue from 'vue';
import VueRouter from 'vue-router';
// import 'babel-polyfill';

import App from './app.vue';

Vue.use(VueRouter);

window.VaultApp = new Vue(App);
window.VaultApp.$mount('#app');
