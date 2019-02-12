import route_wrapper from './page_components/route_wrapper.vue';
import create_step_1 from './page_components/create/step_1.vue';
import create_step_2 from './page_components/create/step_2.vue';
import create_step_3 from './page_components/create/step_3.vue';
import create_step_4 from './page_components/create/step_4.vue';
import create_step_5 from './page_components/create/step_5.vue';
import create_step_6 from './page_components/create/step_6.vue';
import create_step_7 from './page_components/create/step_7.vue';
import create_step_8 from './page_components/create/step_8.vue';
import load_unlock from './page_components/load/unlock.vue';
import load_choose from './page_components/load/choose.vue';
import load_cloud_step_1 from './page_components/load/cloud/step_1.vue';
import vault from './page_components/vault/vault.vue';
import vault_item from './page_components/vault/vault_item.vue';

export default [
  {
    path: '',
    redirect: {
      name: 'create_step_1',
    },
  },
  {
    path: '/create_step_1/',
    component: create_step_1,
    name: 'create_step_1',
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
      {
        path: 'step_4',
        component: create_step_4,
        name: 'create_step_4',
      },
      {
        path: 'step_5',
        component: create_step_5,
        name: 'create_step_5',
      },
      {
        path: 'step_6',
        component: create_step_6,
        name: 'create_step_6',
      },
      {
        path: 'step_7',
        component: create_step_7,
        name: 'create_step_7',
      },
      {
        path: 'step_8',
        component: create_step_8,
        name: 'create_step_8',
      },
    ],
  },
  {
    path: '/load/',
    component: route_wrapper,
    children: [
      {
        path: '',
        name: 'load',
        redirect: {
          name: 'load_choose',
        },
      },
      {
        path: 'choose',
        component: load_choose,
        name: 'load_choose',
      },
      {
        path: 'unlock',
        component: load_unlock,
        name: 'load_unlock',
      },
      {
        path: '/cloud/',
        component: route_wrapper,
        children: [
          {
            path: '',
            redirect: {
              name: 'step_1',
            },
          },
          {
            path: 'step_1',
            component: load_cloud_step_1,
            name: 'load_cloud_step_1',
          },
        ],
      },
    ],
  },
  {
    path: '/vault/',
    component: vault,
    name: 'vault',
    children: [
      {
        path: ':secret_uuid',
        component: vault_item,
        name: 'vault_item',
      },
    ],
  }
];
