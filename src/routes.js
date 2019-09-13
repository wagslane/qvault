import RouteWrapper from './pageComponents/RouteWrapper.vue';
import CreateOrLoad from './pageComponents/CreateOrLoad.vue';
import CreateStep1 from './pageComponents/create/Step1.vue';
import CreateStep2 from './pageComponents/create/Step2.vue';
import CreateStep3 from './pageComponents/create/Step3.vue';
import CreateStep4 from './pageComponents/create/Step4.vue';
import CreateStep5 from './pageComponents/create/Step5.vue';
import CreateStep6 from './pageComponents/create/Step6.vue';

import LoadUnlockStep1 from './pageComponents/load/unlock/Step1.vue';
import LoadUnlockStep2 from './pageComponents/load/unlock/Step2.vue';
import LoadUnlockStep3 from './pageComponents/load/unlock/Step3.vue';
import LoadChoose from './pageComponents/load/Choose.vue';
import LoadDownload from './pageComponents/load/Download.vue';

import ResolveConflicts from './pageComponents/resolveConflicts/ResolveConflicts.vue';

import Vault from './pageComponents/vault/Vault.vue';
import Box from './pageComponents/vault/Box.vue';
import AddBox from './pageComponents/vault/AddBox.vue';
import Secret from './pageComponents/vault/Secret.vue';
import SecretList from './pageComponents/vault/SecretList.vue';

import VaultCreateCryptoWalletStep1 from './pageComponents/vault/createCryptoWallet/Step1.vue';
import VaultCreateCryptoWalletStep2 from './pageComponents/vault/createCryptoWallet/Step2.vue';
import VaultCreateCryptoWalletStep3 from './pageComponents/vault/createCryptoWallet/Step3.vue';

import Settings from './pageComponents/settings/Settings.vue';
import SettingsChangePassword from './pageComponents/settings/ChangePassword.vue';
import SettingsCloudAccountDeleteAccount from './pageComponents/settings/cloudAccount/DeleteAccount.vue';
import SettingsCloudAccountLoginRegister from './pageComponents/settings/cloudAccount/LoginRegister.vue';
import SettingsCharKeyChange from './pageComponents/settings/charKey/Change.vue';
import SettingsCharKeyView from './pageComponents/settings/charKey/View.vue';
import SettingsCharKeyChoose from './pageComponents/settings/charKey/Choose.vue';
import SettingsQrcodeChoose from './pageComponents/settings/qrcode/Choose.vue';
import SettingsQrcodeAddOrChange from './pageComponents/settings/qrcode/AddOrChange.vue';

import UtilityResetCloudPassword from './pageComponents/utility/ResetCloudPassword.vue';

// Using the 'path' to navigate should be avoided if possible
// use the 'name' of the component to navigate

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
        path: 'createOrLoad',
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
          name: 'CreateStep1',
        },
      },
      {
        path: 'step1',
        component: CreateStep1,
        name: 'CreateStep1',
      },
      {
        path: 'step2',
        component: CreateStep2,
        name: 'CreateStep2',
      },
      {
        path: 'step3',
        component: CreateStep3,
        name: 'CreateStep3',
      },
      {
        path: 'step4',
        component: CreateStep4,
        name: 'CreateStep4',
      },
      {
        path: 'step5',
        component: CreateStep5,
        name: 'CreateStep5',
      },
      {
        path: 'step6',
        component: CreateStep6,
        name: 'CreateStep6',
      },
    ],
  },
  {
    path: '/load',
    component: RouteWrapper,
    children: [
      {
        path: '',
        name: 'Load',
        redirect: {
          name: 'LoadChoose',
        },
      },
      {
        path: 'choose',
        component: LoadChoose,
        name: 'LoadChoose',
      },
      {
        path: 'download',
        component: LoadDownload,
        name: 'LoadDownload',
      },
      {
        path: 'unlock',
        component: RouteWrapper,
        children: [
          {
            path: '',
            redirect: {
              name: 'LoadUnlockStep1',
            },
          },
          {
            path: 'step1',
            component: LoadUnlockStep1,
            name: 'LoadUnlockStep1',
          },
          {
            path: 'step2',
            component: LoadUnlockStep2,
            name: 'LoadUnlockStep2',
          },
          {
            path: 'step3',
            component: LoadUnlockStep3,
            name: 'LoadUnlockStep3',
          },
        ],
      },
    ],
  },
  {
    path: '/resolveConflicts',
    component: ResolveConflicts,
    name: 'ResolveConflicts',
  },
  {
    path: '/vault',
    component: Vault,
    name: 'Vault',
    children: [
      {
        path: 'add',
        component: AddBox,
        name: 'AddBox',
      },
      {
        path: 'box/:boxUUID',
        component: Box,
        children: [
          {
            path: '',
            component: SecretList,
            name: 'Box',
          },
          {
            path: 'secret/:secretUUID?',
            component: Secret,
            name: 'Secret',
          },
        ],
      },
      {
        path: 'createCryptoWallet',
        component: RouteWrapper,
        children: [
          {
            path: 'step1/:boxUUID',
            component: VaultCreateCryptoWalletStep1,
            name: 'VaultCreateCryptoWalletStep1',
          },
          {
            path: 'step2/:boxUUID/:ticker',
            component: VaultCreateCryptoWalletStep2,
            name: 'VaultCreateCryptoWalletStep2',
          },
          {
            path: 'step2/:boxUUID/:seed/:ticker',
            component: VaultCreateCryptoWalletStep3,
            name: 'VaultCreateCryptoWalletStep3',
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
          name: 'Settings',
        },
      },
      {
        path: 'settings',
        component: Settings,
        name: 'Settings',
      },
      {
        path: 'changePassword',
        component: SettingsChangePassword,
        name: 'SettingsChangePassword',
      },
      {
        path: 'deleteAccount',
        component: SettingsCloudAccountDeleteAccount,
        name: 'SettingsCloudAccountDeleteAccount',
      },
      {
        path: 'cloudAccount',
        component: RouteWrapper,
        children: [
          {
            path: '',
            redirect: {
              name: 'SettingsCloudAccountLoginRegister',
            },
          },
          {
            path: 'loginRegister',
            component: SettingsCloudAccountLoginRegister,
            name: 'SettingsCloudAccountLoginRegister',
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
            path: 'choose',
            component: SettingsQrcodeChoose,
            name: 'SettingsQrcodeChoose',
          },
          {
            path: 'addOrChange',
            component: SettingsQrcodeAddOrChange,
            name: 'SettingsQrcodeAddOrChange',
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
            path: 'choose',
            component: SettingsCharKeyChoose,
            name: 'SettingsCharKeyChoose',
          },
          {
            path: 'change',
            component: SettingsCharKeyChange,
            name: 'SettingsCharKeyChange',
          },
          {
            path: 'view',
            component: SettingsCharKeyView,
            name: 'SettingsCharKeyView',
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
        path: 'resetCloudPassword/:donePath',
        component: UtilityResetCloudPassword,
        name: 'UtilityResetCloudPassword',
        props: true
      }
    ],
  }
];
