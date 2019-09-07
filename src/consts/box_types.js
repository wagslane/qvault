import crypto_svg from '../img/crypto.svg';
import fin_svg from '../img/fin.svg';
import identity_svg from '../img/identity.svg';
import password_svg from '../img/password.svg';
import notes_svg from '../img/notes.svg';
import server_connection_svg from '../img/server_connection.svg';
import other_svg from '../img/other.svg';
import { mnemonicToXPub, mnemonicToYPub, mnemonicToZPub } from '../lib/qvaultBitcoin';

export default [
  {
    key: 'cryptoWallets',
    displayName: 'Crypto Wallets',
    fields: [
      {
        name: 'Wallet Name',
        type: String,
        required: true,
      },
      {
        name: 'Ticker',
        type: String,
        required: true,
        readonly: true
      },
      {
        name: 'Seed',
        type: String,
        required: true,
        hidden: true,
        readonly: true
      },
      {
        name: 'Password',
        type: String,
        hidden: true
      },
      {
        name: 'XPub',
        type: String,
        readonly: true,
        qrButton: true,
        generated: {
          func: mnemonicToXPub,
          params: [
            {
              key: 'Seed'
            }, {
              value: 0
            } 
          ]
        }
      },
      {
        name: 'YPub',
        type: String,
        readonly: true,
        qrButton: true,
        generated: {
          func: mnemonicToYPub,
          params: [
            {
              key: 'Seed'
            }, {
              value: 0
            } 
          ]
        }
      },
      {
        name: 'ZPub',
        type: String,
        readonly: true,
        qrButton: true,
        generated: {
          func: mnemonicToZPub,
          params: [
            {
              key: 'Seed'
            }, {
              value: 0
            } 
          ]
        }
      },
    ],
    quick_access_name: "Wallet Name",
    quick_access_secrets: [ "Ticker", "XPub" ],
    header_field: 'Wallet Name',
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
        name: 'Wallet Name',
        type: String,
        required: true,
      },
      {
        name: 'Ticker',
        type: String,
      },
      {
        name: 'Key/Seed',
        type: String,
        required: true,
        hidden: true,
      },
      {
        name: 'PIN',
        type: String,
        hidden: true,
      },
      {
        name: 'Password',
        type: String,
        hidden: true,
      },
      {
        name: 'Notes',
        type: 'textarea',
      },
    ],
    quick_access_name: "Wallet Name",
    quick_access_secrets: [ "Password", "Key/Seed" ],
    header_field: 'Wallet Name',
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
        name: 'Institution Name',
        type: String,
        required: true,
      },
      {
        name: 'Username',
        type: String,
      },
      {
        name: 'Password',
        type: String,
        hidden: true,
      },
      {
        name: 'Email',
        type: String,
      },
      {
        name: 'PIN',
        type: String,
        hidden: true,
      },
      {
        name: 'Routing Number',
        type: String,
      },
      {
        name: 'Payment Cards',
        type: Array,
        subfields: [
          {
            name: 'Expiration Date',
            type: String,
          },
          {
            name: 'CVC',
            type: String,
          },
          {
            name: 'Card Number',
            type: String,
          },
          {
            name: 'Notes',
            type: String,
          },
        ],
      },
      {
        name: 'Loans',
        type: Array,
        subfields: [
          {
            name: 'Name',
            type: String,
          },
          {
            name: 'Loan Number',
            type: String,
          },
          {
            name: 'Due Date',
            type: String,
          },
          {
            name: 'Notes',
            type: String,
          },
        ],
      },
      {
        name: 'Account Numbers',
        type: Array,
        subfields: [
          {
            name: 'Name',
            type: String,
          },
          {
            name: 'Account Number',
            type: String,
            hidden: true,
          },
          {
            name: 'Notes',
            type: String,
          },
        ],
      },
      {
        name: 'Notes',
        type: 'textarea',
      },
    ],
    quick_access_name: "Institution Name",
    quick_access_secrets: [ "Email", "Password", "Routing Number" ],
    header_field: 'Institution Name',
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
        name: 'Type',
        help_text: "(Driver's License, Social security, Passport, etc.)",
        type: String,
        required: true,
      },
      {
        name: 'ID Number',
        type: String,
        required: true,
        hidden: true,
      },
      {
        name: 'Issuer',
        help_text: "(Country, State, etc.)",
        type: String,
      },
      {
        name: 'Expiration Date',
        type: String,
      },
      {
        name: 'Notes',
        type: 'textarea',
      },
    ],
    quick_access_name: "Type",
    quick_access_secrets: [ "Issuer", "ID Number" ],
    header_field: 'Type',
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
        name: 'Issuer',
        help_text: '(Website, Wifi, Device)',
        type: String,
        required: true,
      },
      {
        name: 'Username',
        type: String,
      },
      {
        name: 'Password',
        type: String,
        required: true,
        hidden: true,
      },
      {
        name: 'Email',
        type: String,
      },
      {
        name: 'Link',
        type: String,
      },
      {
        name: '2FA Secret',
        type: String,
        hidden: true,
      },
      {
        name: 'PIN',
        type: String,
        hidden: true,
      },
      {
        name: 'Notes',
        type: 'textarea',
      },
    ],
    quick_access_name: "Issuer",
    quick_access_secrets: [ "Username", "Email", "Password" ],
    header_field: 'Issuer',
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
        name: 'Name',
        type: String,
        required: true,
      },
      {
        name: 'Type',
        help_text: '(Database, Bastion, ec2, etc.)',
        type: String,
      },
      {
        name: 'Connection String',
        type: String,
        hidden: true,
      },
      {
        name: 'Hostname',
        type: String,
      },
      {
        name: 'Port',
        type: String,
      },
      {
        name: 'Username',
        type: String,
      },
      {
        name: 'Password',
        type: String,
        hidden: true,
      },
      {
        name: 'Alias',
        type: String,
      },
      {
        name: 'Public Key',
        type: String,
      },
      {
        name: 'Private Key',
        type: String,
        hidden: true,
      },
      {
        name: 'Notes',
        type: 'textarea',
      },
    ],
    quick_access_name: "Name",
    quick_access_secrets: [ "Hostname", "Connection String" ],
    header_field: 'Name',
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
        name: 'Name',
        type: String,
        required: true,
      },
      {
        name: 'Notes',
        type: 'textarea',
        required: true,
      },
    ],
    quick_access_name: "Name",
    quick_access_secrets: [ "Notes" ],
    header_field: 'Name',
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
        name: 'Name',
        type: String,
        required: true,
      },
      {
        name: 'Secret',
        type: String,
        required: true,
        hidden: true,
      },
      {
        name: 'Notes',
        type: 'textarea',
      },
    ],
    quick_access_name: "Name",
    quick_access_secrets: [ "Secret" ],
    header_field: 'Name',
    icon: {
      img: other_svg,
      fill: true,
    }
  },
];
