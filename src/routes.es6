import route_wrapper from './page_components/route_wrapper.vue';
import create_step_1 from './page_components/create/step_1.vue';
import create_step_2 from './page_components/create/step_2.vue';
import create_step_3 from './page_components/create/step_3.vue';
import create_step_4 from './page_components/create/step_4.vue';
import create_step_5 from './page_components/create/step_5.vue';
import create_step_6 from './page_components/create/step_6.vue';
import create_step_7 from './page_components/create/step_7.vue';

import load_unlock_step_1 from './page_components/load/unlock/step_1.vue';
import load_unlock_step_2 from './page_components/load/unlock/step_2.vue';
import load_unlock_step_3 from './page_components/load/unlock/step_3.vue';
import load_choose from './page_components/load/choose.vue';
import load_download from './page_components/load/download.vue';

import vault from './page_components/vault/vault.vue';
import box from './page_components/vault/box.vue';
import add_box from './page_components/vault/add_box.vue';

import settings from './page_components/settings/settings.vue';
import settings_change_password from './page_components/settings/change_password.vue';
import settings_delete_account from './page_components/settings/delete_account.vue';
import settings_signup from './page_components/settings/signup.vue';
import settings_change_qcard from './page_components/settings/change_qcard.vue';

export default [
  {
    path: '',
    redirect: {
      name: 'create_step_1',
    },
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
        path: 'download',
        component: load_download,
        name: 'load_download',
      },
      {
        path: '/unlock/',
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
            component: load_unlock_step_1,
            name: 'load_unlock_step_1',
          },
          {
            path: 'step_2',
            component: load_unlock_step_2,
            name: 'load_unlock_step_2',
          },
          {
            path: 'step_3',
            component: load_unlock_step_3,
            name: 'load_unlock_step_3',
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
        path: 'add',
        component: add_box,
        name: 'add_box',
      },
      {
        path: 'box/:box_uuid',
        component: box,
        name: 'box',
      },
    ],
  },
  {
    path: '/settings/',
    component: route_wrapper,
    children: [
      {
        path: '',
        redirect: {
          name: 'settings',
        },
      },
      {
        path: 'settings',
        component: settings,
        name: 'settings',
      },
      {
        path: 'change_password',
        component: settings_change_password,
        name: 'settings_change_password',
      },
      {
        path: 'delete_account',
        component: settings_delete_account,
        name: 'settings_delete_account',
      },
      {
        path: 'signup',
        component: settings_signup,
        name: 'settings_signup',
      },
      {
        path: 'change_qcard',
        component: settings_change_qcard,
        name: 'settings_change_qcard',
      },
    ],
  }
];
