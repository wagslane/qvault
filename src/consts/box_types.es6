export default [
  {
    name: 'Cryptocurrency',
    fields: [
      {
        name: 'Wallet Name',
        type: String,
        required: true,
      },
      {
        name: 'Ticker',
        type: String,
        required: false,
      },
      {
        name: 'Key/Seed',
        type: String,
        required: true,
      },
      {
        name: 'PIN',
        type: String,
        required: false,
      },
      {
        name: 'Password',
        type: String,
        required: false,
      },
      {
        name: 'Notes',
        type: String,
        required: false,
      },
    ],
    quick_access_name: "Wallet Name",
    quick_access_secrets: [ "Password", "Key/Seed" ],
    header_field: 'Wallet Name',
  },
  {
    name: 'Financial Institution',
    fields: [
      {
        name: 'Institution Name',
        type: String,
        required: true,
      },
      {
        name: 'Routing Number',
        type: String,
        required: false,
      },
      {
        name: 'Payment Cards',
        type: Array,
        required: false,
        subfields: [
          {
            name: 'Expiration Date',
            type: String,
            required: false,
          },
          {
            name: 'CVC',
            type: String,
            required: false,
          },
          {
            name: 'Card Number',
            type: String,
            required: true,
          },
          {
            name: 'Notes',
            type: String,
            required: false,
          },
        ],
      },
      {
        name: 'Loans',
        type: Array,
        required: false,
        subfields: [
          {
            name: 'Name',
            type: String,
            required: true,
          },
          {
            name: 'Loan Number',
            type: String,
            required: true,
          },
          {
            name: 'Due Date',
            type: String,
            required: false,
          },
          {
            name: 'Notes',
            type: String,
            required: false,
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
          },
          {
            name: 'Account Number',
            type: String,
            required: true,
          },
          {
            name: 'Notes',
            type: String,
            required: false,
          },
        ],
      },
      {
        name: 'Notes',
        type: String,
        required: false,
      },
    ],
    quick_access_name: "Institution Name",
    quick_access_secrets: [ "Routing Number" ],
    header_field: 'Institution Name',
  },
  {
    name: 'Identification',
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
      },
      {
        name: 'Issuer',
        help_text: "(Country, State, etc.)",
        type: String,
        required: false,
      },
      {
        name: 'Expiration Date',
        type: String,
        required: false,
      },
      {
        name: 'Notes',
        type: String,
        required: false,
      },
    ],
    quick_access_name: "Type",
    quick_access_secrets: [ "Issuer", "ID Number" ],
    header_field: 'Type',
  },
  {
    name: 'Passwords',
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
        required: false,
      },
      {
        name: 'Password',
        type: String,
        required: true,
      },
      {
        name: 'Email',
        type: String,
        required: false,
      },
      {
        name: 'Link',
        type: String,
        required: false,
      },
      {
        name: '2FA Secret',
        type: String,
        required: false,
      },
      {
        name: 'Notes',
        type: String,
        required: false,
      },
    ],
    quick_access_name: "Issuer",
    quick_access_secrets: [ "Username", "Password" ],
    header_field: 'Issuer',
  },
  {
    name: 'Server Connection',
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
        required: false,
      },
      {
        name: 'Connection String',
        type: String,
        required: false,
      },
      {
        name: 'Hostname',
        type: String,
        required: false,
      },
      {
        name: 'Port',
        type: String,
        required: false,
      },
      {
        name: 'Username',
        type: String,
        required: false,
      },
      {
        name: 'Password',
        type: String,
        required: false,
      },
      {
        name: 'Alias',
        type: String,
        required: false,
      },
      {
        name: 'Public Key',
        type: String,
        required: false,
      },
      {
        name: 'Private Key',
        type: String,
        required: false,
      },
      {
        name: 'Notes',
        type: String,
        required: false,
      },
    ],
    quick_access_name: "Name",
    quick_access_secrets: [ "Hostname", "Connection String" ],
    header_field: 'Name',
  },
  {
    name: 'Notes',
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
  },
];
