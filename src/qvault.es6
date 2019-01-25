import '@babel/polyfill';
import Vue from 'vue';
import VueRouter from 'vue-router';
import AsyncComputed from 'vue-async-computed';

import QvaultApp from './qvault.vue';

Vue.use(VueRouter);
Vue.use(AsyncComputed);

window.QvaultApp = new Vue(QvaultApp);
window.QvaultApp.$mount('#qvault');
