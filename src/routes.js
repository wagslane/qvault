import routeWrapper from './pageComponents/routeWrapper.vue';
import createOrLoad from './pageComponents/createOrLoad.vue';
import createStep1 from './pageComponents/create/step1.vue';
import createStep2 from './pageComponents/create/step2.vue';
import createStep3 from './pageComponents/create/step3.vue';
import createStep4 from './pageComponents/create/step4.vue';
import createStep5 from './pageComponents/create/step5.vue';
import createStep6 from './pageComponents/create/step6.vue';

import loadUnlockStep1 from './pageComponents/load/unlock/step1.vue';
import loadUnlockStep2 from './pageComponents/load/unlock/step2.vue';
import loadUnlockStep3 from './pageComponents/load/unlock/step3.vue';
import loadChoose from './pageComponents/load/choose.vue';
import loadDownload from './pageComponents/load/download.vue';

import vault from './pageComponents/vault/vault.vue';
import box from './pageComponents/vault/box.vue';
import addBox from './pageComponents/vault/addBox.vue';
import secret from './pageComponents/vault/secret.vue';
import secretList from './pageComponents/vault/secretList.vue';

import settings from './pageComponents/settings/settings.vue';
import settingsChangePassword from './pageComponents/settings/changePassword.vue';
import settingsDeleteAccount from './pageComponents/settings/deleteAccount.vue';
import settingsCloudAccountLoginRegister from './pageComponents/settings/cloudAccount/loginRegister.vue';
import settingsChangeCharKey from './pageComponents/settings/changeCharKey.vue';
import settingsQrcodeChoose from './pageComponents/settings/qrcode/choose.vue';
import settingsQrcodeAddOrChange from './pageComponents/settings/qrcode/addOrChange.vue';

import utilityResetCloudPassword from './pageComponents/utility/resetCloudPassword.vue';

export default [
  {
    path: '/',
    component: routeWrapper,
    children: [
      {
        path: '',
        name: 'root',
        redirect: {
          name: 'createOrLoad',
        },
      },
      {
        path: 'createOrLoad',
        component: createOrLoad,
        name: 'createOrLoad',
      },
    ]
  },
  {
    path: '/create',
    component: routeWrapper,
    children: [
      {
        path: '',
        name: 'create',
        redirect: {
          name: 'createStep1',
        },
      },
      {
        path: 'step1',
        component: createStep1,
        name: 'createStep1',
      },
      {
        path: 'step2',
        component: createStep2,
        name: 'createStep2',
      },
      {
        path: 'step3',
        component: createStep3,
        name: 'createStep3',
      },
      {
        path: 'step4',
        component: createStep4,
        name: 'createStep4',
      },
      {
        path: 'step5',
        component: createStep5,
        name: 'createStep5',
      },
      {
        path: 'step6',
        component: createStep6,
        name: 'createStep6',
      },
    ],
  },
  {
    path: '/load',
    component: routeWrapper,
    children: [
      {
        path: '',
        name: 'load',
        redirect: {
          name: 'loadChoose',
        },
      },
      {
        path: 'choose',
        component: loadChoose,
        name: 'loadChoose',
      },
      {
        path: 'download',
        component: loadDownload,
        name: 'loadDownload',
      },
      {
        path: 'unlock',
        component: routeWrapper,
        children: [
          {
            path: '',
            redirect: {
              name: 'step1',
            },
          },
          {
            path: 'step1',
            component: loadUnlockStep1,
            name: 'loadUnlockStep1',
          },
          {
            path: 'step2',
            component: loadUnlockStep2,
            name: 'loadUnlockStep2',
          },
          {
            path: 'step3',
            component: loadUnlockStep3,
            name: 'loadUnlockStep3',
          },
        ],
      },
    ],
  },
  {
    path: '/vault',
    component: vault,
    name: 'vault',
    children: [
      {
        path: 'add',
        component: addBox,
        name: 'addBox',
      },
      {
        path: 'box/:box_uuid',
        component: box,
        children: [
          {
            path: '',
            component: secretList,
            name: 'box',
          },
          {
            path: 'secret/:secret_uuid?',
            component: secret,
            name: 'secret',
          },
        ],
      },
    ],
  },
  {
    path: '/settings',
    component: routeWrapper,
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
        path: 'changePassword',
        component: settingsChangePassword,
        name: 'settingsChangePassword',
      },
      {
        path: 'deleteAccount',
        component: settingsDeleteAccount,
        name: 'settingsDeleteAccount',
      },
      {
        path: 'changeCharKey',
        component: settingsChangeCharKey,
        name: 'settingsChangeCharKey',
      },
      {
        path: 'cloudAccount',
        component: routeWrapper,
        children: [
          {
            path: '',
            redirect: {
              name: 'loginRegister',
            },
          },
          {
            path: 'loginRegister',
            component: settingsCloudAccountLoginRegister,
            name: 'settingsCloudAccountLoginRegister',
          }
        ],
      },
      {
        path: 'qrcode',
        component: routeWrapper,
        children: [
          {
            path: '',
            redirect: {
              name: 'choose',
            },
          },
          {
            path: 'choose',
            component: settingsQrcodeChoose,
            name: 'settingsQrcodeChoose',
          },
          {
            path: 'addOrChange',
            component: settingsQrcodeAddOrChange,
            name: 'settingsQrcodeAddOrChange',
          },
        ],
      },
    ],
  },
  {
    path: '/utility',
    component: routeWrapper,
    children: [
      {
        path: 'resetCloudPassword/:donePath',
        component: utilityResetCloudPassword,
        name: 'utilityResetCloudPassword',
        props: true
      }
    ],
  }
];
