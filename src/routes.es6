import Start from './page_components/start.vue';

export default [
  {
    path: '',
    redirect: {
      name: 'start',
    },
  },
  {
    path: '/start/',
    component: Start,
    name: 'start',
  },
];
