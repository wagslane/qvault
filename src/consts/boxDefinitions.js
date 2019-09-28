import crypto_svg from '../img/crypto.svg';
import fin_svg from '../img/fin.svg';
import identity_svg from '../img/identity.svg';
import password_svg from '../img/password.svg';
import notes_svg from '../img/notes.svg';
import server_connection_svg from '../img/server_connection.svg';
import other_svg from '../img/other.svg';
import { 
  mnemonicToXPubBTC,
  mnemonicToYPubBTC,
  mnemonicToZPubBTC,
  mnemonicToXPubBCH 
} from '../lib/qvaultBitcoin';

export default [
  {
    key: 'cryptoWallets',
    displayName: 'Crypto Wallets',
    fields: [
      {
        key: 'walletName',
        displayName: 'Wallet Name',
        type: String,
        required: true,
      },
      {
        key: 'ticker',
        displayName: 'Ticker',
        type: String,
        required: true,
        readonly: true
      },
      {
        key: 'seed',
        displayName: 'Seed',
        type: String,
        required: true,
        hidden: true,
        readonly: true
      },
      {
        key: 'password',
        displayName: 'Password',
        type: String,
        hidden: true
      },
      {
        key: 'xpub',
        displayName: 'XPub BTC',
        type: String,
        readonly: true,
        qrButton: true,
        shouldShow: {
          func: ticker => ticker === 'BTC',
          params: [
            {
              key: 'ticker'
            }
          ]
        },
        generated: {
          func: mnemonicToXPubBTC,
          params: [
            {
              key: 'seed'
            }, {
              value: 0
            } 
          ]
        }
      },
      {
        key: 'ypub',
        displayName: 'YPub BTC',
        type: String,
        readonly: true,
        qrButton: true,
        shouldShow: {
          func: ticker => ticker === 'BTC',
          params: [
            {
              key: 'ticker'
            }
          ]
        },
        generated: {
          func: mnemonicToYPubBTC,
          params: [
            {
              key: 'seed'
            }, {
              value: 0
            } 
          ]
        }
      },
      {
        key: 'zpub',
        displayName: 'ZPub BTC',
        type: String,
        readonly: true,
        qrButton: true,
        shouldShow: {
          func: ticker => ticker === 'BTC',
          params: [
            {
              key: 'ticker'
            }
          ]
        },
        generated: {
          func: mnemonicToZPubBTC,
          params: [
            {
              key: 'seed'
            }, {
              value: 0
            } 
          ]
        }
      },
      {
        key: 'xpubBCH',
        displayName: 'XPub BCH',
        type: String,
        readonly: true,
        qrButton: true,
        shouldShow: {
          func: ticker => ticker === 'BCH',
          params: [
            {
              key: 'ticker'
            }
          ]
        },
        generated: {
          func: mnemonicToXPubBCH,
          params: [
            {
              key: 'seed'
            }, {
              value: 0
            }
          ]
        }
      },
    ],
    quick_access_name: "walletName",
    quick_access_secrets: [ "ticker", "xpub" ],
    header_field: 'walletName',
    icon: {
      img: crypto_svg,
      fill: true,
    }
  },
  {
    key: 'cryptocurrency',
    displayName: 'Crypto Backups',
    fields: [
      {
        key: 'walletName',
        displayName: 'Wallet Name',
        type: String,
        required: true,
      },
      {
        key: 'ticker',
        displayName: 'Ticker',
        type: String,
      },
      {
        key: 'seed',
        displayName: 'Key/Seed',
        type: String,
        required: true,
        hidden: true,
      },
      {
        key: 'pin',
        displayName: 'PIN',
        type: String,
        hidden: true,
      },
      {
        key: 'password',
        displayName: 'Password',
        type: String,
        hidden: true,
      },
      {
        key: 'notes',
        displayName: 'Notes',
        type: 'textarea',
      },
    ],
    quick_access_name: "walletName",
    quick_access_secrets: [ "password", "seed" ],
    header_field: 'walletName',
    icon: {
      img: crypto_svg,
      fill: true,
    }
  },
  {
    key: 'financialInstitution',
    displayName: 'Financial Institution',
    fields: [
      {
        key: 'institutionName',
        displayName: 'Institution Name',
        type: String,
        required: true,
      },
      {
        key: 'username',
        displayName: 'Username',
        type: String,
      },
      {
        key: 'password',
        displayName: 'Password',
        type: String,
        hidden: true,
      },
      {
        key: 'email',
        displayName: 'Email',
        type: String,
      },
      {
        key: 'pin',
        displayName: 'PIN',
        type: String,
        hidden: true,
      },
      {
        key: 'routingNumber',
        displayName: 'Routing Number',
        type: String,
      },
      {
        key: 'paymentCards',
        displayName: 'Payment Cards',
        type: Array,
        subfields: [
          {
            key: 'expirationDate',
            displayName: 'Expiration Date',
            type: String,
          },
          {
            key: 'cvc',
            displayName: 'CVC',
            type: String,
          },
          {
            key: 'cardNumber',
            displayName: 'Card Number',
            type: String,
          },
          {
            key: 'notes',
            displayName: 'Notes',
            type: String,
          },
        ],
      },
      {
        key: 'loans',
        displayName: 'Loans',
        type: Array,
        subfields: [
          {
            key: 'name',
            displayName: 'Name',
            type: String,
          },
          {
            key: 'loanNumber',
            displayName: 'Loan Number',
            type: String,
          },
          {
            key: 'dueDate',
            displayName: 'Due Date',
            type: String,
          },
          {
            key: 'notes',
            displayName: 'Notes',
            type: String,
          },
        ],
      },
      {
        key: 'accountNumbers',
        displayName: 'Account Numbers',
        type: Array,
        subfields: [
          {
            key: 'name',
            displayName: 'Name',
            type: String,
          },
          {
            key: 'accountNumber',
            displayName: 'Account Number',
            type: String,
            hidden: true,
          },
          {
            key: 'notes',
            displayName: 'Notes',
            type: String,
          },
        ],
      },
      {
        key: 'notes',
        displayName: 'Notes',
        type: 'textarea',
      },
    ],
    quick_access_name: "institutionName",
    quick_access_secrets: [ "email", "password", "routingNumber" ],
    header_field: 'institutionName',
    icon: {
      img: fin_svg,
      fill: true,
    }
  },
  {
    key: 'identification',
    displayName: 'Identification',
    fields: [
      {
        key: 'type',
        displayName: 'Type',
        help_text: "(Driver's License, Social security, Passport, etc.)",
        type: String,
        required: true,
      },
      {
        key: 'idNumber',
        displayName: 'ID Number',
        type: String,
        required: true,
        hidden: true,
      },
      {
        key: 'issuer',
        displayName: 'Issuer',
        help_text: "(Country, State, etc.)",
        type: String,
      },
      {
        key: 'expirationDate',
        displayName: 'Expiration Date',
        type: String,
      },
      {
        key: 'notes',
        displayName: 'Notes',
        type: 'textarea',
      },
    ],
    quick_access_name: "type",
    quick_access_secrets: [ "issuer", "idNumber" ],
    header_field: 'type',
    icon: {
      img: identity_svg,
      fill: false,
    }
  },
  {
    key: 'passwords',
    displayName: 'Passwords',
    fields: [
      {
        key: 'issuer',
        displayName: 'Issuer',
        help_text: '(Website, Wifi, Device)',
        type: String,
        required: true,
      },
      {
        key: 'username',
        displayName: 'Username',
        type: String,
      },
      {
        key: 'password',
        displayName: 'Password',
        type: String,
        required: true,
        hidden: true,
      },
      {
        key: 'email',
        displayName: 'Email',
        type: String,
      },
      {
        key: 'link',
        displayName: 'Link',
        type: String,
      },
      {
        key: '2faSecret',
        displayName: '2FA Secret',
        type: String,
        hidden: true,
      },
      {
        key: 'pin',
        displayName: 'PIN',
        type: String,
        hidden: true,
      },
      {
        key: 'notes',
        displayName: 'Notes',
        type: 'textarea',
      },
    ],
    quick_access_name: "issuer",
    quick_access_secrets: [ "username", "email", "password" ],
    header_field: 'issuer',
    icon: {
      img: password_svg,
      fill: true,
    }
  },
  {
    key: 'serverConnection',
    displayName: 'Server Connection',
    fields: [
      {
        key: 'name',
        displayName: 'Name',
        type: String,
        required: true,
      },
      {
        key: 'type',
        displayName: 'Type',
        help_text: '(Database, Bastion, ec2, etc.)',
        type: String,
      },
      {
        key: 'connectionString',
        displayName: 'Connection String',
        type: String,
        hidden: true,
      },
      {
        key: 'hostname',
        displayName: 'Hostname',
        type: String,
      },
      {
        key: 'port',
        displayName: 'Port',
        type: String,
      },
      {
        key: 'username',
        displayName: 'Username',
        type: String,
      },
      {
        key: 'password',
        displayName: 'Password',
        type: String,
        hidden: true,
      },
      {
        key: 'alias',
        displayName: 'Alias',
        type: String,
      },
      {
        key: 'publicKey',
        displayName: 'Public Key',
        type: String,
      },
      {
        key: 'privateKey',
        displayName: 'Private Key',
        type: String,
        hidden: true,
      },
      {
        key: 'notes',
        displayName: 'Notes',
        type: 'textarea',
      },
    ],
    quick_access_name: "name",
    quick_access_secrets: [ "hostname", "connectionString" ],
    header_field: 'name',
    icon: {
      img: server_connection_svg,
      fill: false,
    }
  },
  {
    key: 'notes',
    displayName: 'Notes',
    fields: [
      {
        key: 'name',
        displayName: 'Name',
        type: String,
        required: true,
      },
      {
        key: 'notes',
        displayName: 'Notes',
        type: 'textarea',
        required: true,
      },
    ],
    quick_access_name: "name",
    quick_access_secrets: [ "notes" ],
    header_field: 'name',
    icon: {
      img: notes_svg,
      fill: true,
    }
  },
  {
    key: 'other',
    displayName: 'Custom',
    fields: [
      {
        key: 'name',
        displayName: 'Name',
        type: String,
        required: true,
      },
      {
        key: 'secret',
        displayName: 'Secret',
        type: String,
        required: true,
        hidden: true,
      },
      {
        key: 'notes',
        displayName: 'Notes',
        type: 'textarea',
      },
    ],
    quick_access_name: "name",
    quick_access_secrets: [ "secret" ],
    header_field: 'name',
    icon: {
      img: other_svg,
      fill: true,
    }
  },
];
