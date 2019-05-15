import crypto_svg from '../img/crypto.svg';
import fin_svg from '../img/fin.svg';
import identity_svg from '../img/identity.svg';
import password_svg from '../img/password.svg';
import notes_svg from '../img/notes.svg';
import server_connection_svg from '../img/server_connection.svg';
import other_svg from '../img/other.svg';

export default [
  {
    name: 'Cryptocurrency',
    fields: [
      {
        name: 'Wallet Name',
        type: String,
        required: true,
        hidden: false,
      },
      {
        name: 'Ticker',
        type: String,
        required: false,
        hidden: false,
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
        required: false,
        hidden: true,
      },
      {
        name: 'Password',
        type: String,
        required: false,
        hidden: true,
      },
      {
        name: 'Notes',
        type: 'textarea',
        required: false,
        hidden: false,
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
    name: 'Financial Institution',
    fields: [
      {
        name: 'Institution Name',
        type: String,
        required: true,
        hidden: false,
      },
      {
        name: 'Routing Number',
        type: String,
        required: false,
        hidden: false,
      },
      {
        name: 'Payment Cards',
        type: Array,
        required: false,
        hidden: false,
        subfields: [
          {
            name: 'Expiration Date',
            type: String,
            required: false,
            hidden: false,
          },
          {
            name: 'CVC',
            type: String,
            required: false,
            hidden: false,
          },
          {
            name: 'Card Number',
            type: String,
            required: true,
            hidden: false,
          },
          {
            name: 'Notes',
            type: String,
            required: false,
            hidden: false,
          },
        ],
      },
      {
        name: 'Loans',
        type: Array,
        required: false,
        hidden: false,
        subfields: [
          {
            name: 'Name',
            type: String,
            required: true,
            hidden: false,
          },
          {
            name: 'Loan Number',
            type: String,
            required: true,
            hidden: false,
          },
          {
            name: 'Due Date',
            type: String,
            required: false,
            hidden: false,
          },
          {
            name: 'Notes',
            type: String,
            required: false,
            hidden: false,
          },
        ],
      },
      {
        name: 'Account Numbers',
        type: Array,
        required: false,
        subfields: [
          {
            name: 'Name',
            type: String,
            required: true,
            hidden: false,
          },
          {
            name: 'Account Number',
            type: String,
            required: true,
            hidden: true,
          },
          {
            name: 'Notes',
            type: String,
            required: false,
            hidden: false,
          },
        ],
      },
      {
        name: 'Notes',
        type: 'textarea',
        required: false,
        hidden: false,
      },
    ],
    quick_access_name: "Institution Name",
    quick_access_secrets: [ "Routing Number" ],
    header_field: 'Institution Name',
    icon: {
      img: fin_svg,
      fill: true,
    }
  },
  {
    name: 'Identification',
    fields: [
      {
        name: 'Type',
        help_text: "(Driver's License, Social security, Passport, etc.)",
        type: String,
        required: true,
        hidden: false,
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
        required: false,
        hidden: false,
      },
      {
        name: 'Expiration Date',
        type: String,
        required: false,
        hidden: false,
      },
      {
        name: 'Notes',
        type: 'textarea',
        required: false,
        hidden: false,
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
    name: 'Passwords',
    fields: [
      {
        name: 'Issuer',
        help_text: '(Website, Wifi, Device)',
        type: String,
        required: true,
        hidden: false,
      },
      {
        name: 'Username',
        type: String,
        required: false,
        hidden: false,
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
        required: false,
        hidden: false,
      },
      {
        name: 'Link',
        type: String,
        required: false,
        hidden: false,
      },
      {
        name: '2FA Secret',
        type: String,
        required: false,
        hidden: true,
      },
      {
        name: 'Notes',
        type: 'textarea',
        required: false,
        hidden: false,
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
    name: 'Server Connection',
    fields: [
      {
        name: 'Name',
        type: String,
        required: true,
        hidden: false,
      },
      {
        name: 'Type',
        help_text: '(Database, Bastion, ec2, etc.)',
        type: String,
        required: false,
        hidden: false,
      },
      {
        name: 'Connection String',
        type: String,
        required: false,
        hidden: true,
      },
      {
        name: 'Hostname',
        type: String,
        required: false,
        hidden: false,
      },
      {
        name: 'Port',
        type: String,
        required: false,
        hidden: false,
      },
      {
        name: 'Username',
        type: String,
        required: false,
        hidden: false,
      },
      {
        name: 'Password',
        type: String,
        required: false,
        hidden: true,
      },
      {
        name: 'Alias',
        type: String,
        required: false,
        hidden: false,
      },
      {
        name: 'Public Key',
        type: String,
        required: false,
        hidden: false,
      },
      {
        name: 'Private Key',
        type: String,
        required: false,
        hidden: true,
      },
      {
        name: 'Notes',
        type: 'textarea',
        required: false,
        hidden: false,
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
    name: 'Notes',
    fields: [
      {
        name: 'Name',
        type: String,
        required: true,
        hidden: false,
      },
      {
        name: 'Notes',
        type: 'textarea',
        required: true,
        hidden: false,
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
    name: 'Other',
    fields: [
      {
        name: 'Name',
        type: String,
        required: true,
        hidden: false,
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
        required: false,
        hidden: false,
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
