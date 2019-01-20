import route_wrapper from './page_components/route_wrapper.vue';
import start from './page_components/start.vue';
import create_step_1 from './page_components/create/step_1.vue';
import create_step_2 from './page_components/create/step_2.vue';
import create_step_3 from './page_components/create/step_3.vue';

export default [
  {
    path: '',
    redirect: {
      name: 'start',
    },
  },
  {
    path: '/start/',
    component: start,
    name: 'start',
  },
  {
    path: '/create/',
    component: route_wrapper,
    children: [
      {
        path: '',
        redirect: {
          name: 'create_step_1',
        },
      },
      {
        path: 'step_1',
        component: create_step_1,
        name: 'create_step_1',
      },
      {
        path: 'step_2',
        component: create_step_2,
        name: 'create_step_2',
      },
      {
        path: 'step_3',
        component: create_step_3,
        name: 'create_step_3',
      },
    ],
  },
];
