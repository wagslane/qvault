import RouteWrapper from './pageComponents/RouteWrapper.vue';
import CreateOrLoad from './pageComponents/CreateOrLoad.vue';
import createStep1 from './pageComponents/create/Step1.vue';
import createStep2 from './pageComponents/create/Step2.vue';
import createStep3 from './pageComponents/create/Step3.vue';
import createStep4 from './pageComponents/create/Step4.vue';
import createStep5 from './pageComponents/create/Step5.vue';
import createStep6 from './pageComponents/create/Step6.vue';

import loadUnlockStep1 from './pageComponents/load/unlock/Step1.vue';
import loadUnlockStep2 from './pageComponents/load/unlock/Step2.vue';
import loadUnlockStep3 from './pageComponents/load/unlock/Step3.vue';
import loadChoose from './pageComponents/load/Choose.vue';
import loadDownload from './pageComponents/load/Download.vue';

import vault from './pageComponents/vault/Vault.vue';
import box from './pageComponents/vault/Box.vue';
import addBox from './pageComponents/vault/AddBox.vue';
import secret from './pageComponents/vault/Secret.vue';
import secretList from './pageComponents/vault/SecretList.vue';

import settings from './pageComponents/settings/Settings.vue';
import settingsChangePassword from './pageComponents/settings/ChangePassword.vue';
import settingsDeleteAccount from './pageComponents/settings/DeleteAccount.vue';
import settingsCloudAccountLoginRegister from './pageComponents/settings/cloudAccount/LoginRegister.vue';
import settingsCharKeyChange from './pageComponents/settings/charKey/Change.vue';
import settingsCharKeyView from './pageComponents/settings/charKey/View.vue';
import settingsCharKeyChoose from './pageComponents/settings/charKey/Choose.vue';
import settingsQrcodeChoose from './pageComponents/settings/qrcode/Choose.vue';
import settingsQrcodeAddOrChange from './pageComponents/settings/qrcode/AddOrChange.vue';

import utilityResetCloudPassword from './pageComponents/utility/ResetCloudPassword.vue';

export default [
  {
    path: '/',
    component: RouteWrapper,
    children: [
      {
        path: '',
        name: 'root',
        redirect: {
          name: 'CreateOrLoad',
        },
      },
      {
        path: 'CreateOrLoad',
        component: CreateOrLoad,
        name: 'CreateOrLoad',
      },
    ]
  },
  {
    path: '/create',
    component: RouteWrapper,
    children: [
      {
        path: '',
        name: 'create',
        redirect: {
          name: 'createStep1',
        },
      },
      {
        path: 'Step1',
        component: createStep1,
        name: 'createStep1',
      },
      {
        path: 'Step2',
        component: createStep2,
        name: 'createStep2',
      },
      {
        path: 'Step3',
        component: createStep3,
        name: 'createStep3',
      },
      {
        path: 'Step4',
        component: createStep4,
        name: 'createStep4',
      },
      {
        path: 'Step5',
        component: createStep5,
        name: 'createStep5',
      },
      {
        path: 'Step6',
        component: createStep6,
        name: 'createStep6',
      },
    ],
  },
  {
    path: '/load',
    component: RouteWrapper,
    children: [
      {
        path: '',
        name: 'load',
        redirect: {
          name: 'loadChoose',
        },
      },
      {
        path: 'Choose',
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
        component: RouteWrapper,
        children: [
          {
            path: '',
            redirect: {
              name: 'Step1',
            },
          },
          {
            path: 'Step1',
            component: loadUnlockStep1,
            name: 'loadUnlockStep1',
          },
          {
            path: 'Step2',
            component: loadUnlockStep2,
            name: 'loadUnlockStep2',
          },
          {
            path: 'Step3',
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
    component: RouteWrapper,
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
        path: 'ChangePassword',
        component: settingsChangePassword,
        name: 'settingsChangePassword',
      },
      {
        path: 'DeleteAccount',
        component: settingsDeleteAccount,
        name: 'settingsDeleteAccount',
      },
      {
        path: 'cloudAccount',
        component: RouteWrapper,
        children: [
          {
            path: '',
            redirect: {
              name: 'LoginRegister',
            },
          },
          {
            path: 'LoginRegister',
            component: settingsCloudAccountLoginRegister,
            name: 'settingsCloudAccountLoginRegister',
          }
        ],
      },
      {
        path: 'qrcode',
        component: RouteWrapper,
        children: [
          {
            path: '',
            redirect: {
              name: 'Choose',
            },
          },
          {
            path: 'Choose',
            component: settingsQrcodeChoose,
            name: 'settingsQrcodeChoose',
          },
          {
            path: 'AddOrChange',
            component: settingsQrcodeAddOrChange,
            name: 'settingsQrcodeAddOrChange',
          },
        ],
      },
      {
        path: 'charKey',
        component: RouteWrapper,
        children: [
          {
            path: '',
            redirect: {
              name: 'Choose',
            },
          },
          {
            path: 'Choose',
            component: settingsCharKeyChoose,
            name: 'settingsCharKeyChoose',
          },
          {
            path: 'Change',
            component: settingsCharKeyChange,
            name: 'settingsCharKeyChange',
          },
          {
            path: 'View',
            component: settingsCharKeyView,
            name: 'settingsCharKeyView',
          },
        ],
      },
    ],
  },
  {
    path: '/utility',
    component: RouteWrapper,
    children: [
      {
        path: 'ResetCloudPassword.vue/:donePath',
        component: utilityResetCloudPassword,
        name: 'utilityResetCloudPassword',
        props: true
      }
    ],
  }
];
