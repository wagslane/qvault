export default [
  {
    name: 'Cryptocurrency',
    fields: [
      {
        name: 'Wallet Name',
        type: String,
      },
      {
        name: 'Ticker',
        type: String,
      },
      {
        name: 'Key/Seed',
        type: String,
      },
      {
        name: 'PIN',
        type: String,
      },
      {
        name: 'Password',
        type: String,
      },
      {
        name: 'Notes',
        type: String,
      },
    ],
    quick_access_fields: [
      'Wallet Name',
    ],
    header_field: 'Wallet Name',
  },
  {
    name: 'Financial Institution',
    fields: [
      {
        name: 'Institution Name',
        type: String,
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
          },
          {
            name: 'Notes',
            type: String,
          },
        ],
      },
      {
        name: 'Notes',
        type: String,
      },
    ],
    quick_access_fields: [
      'Institution Name',
    ],
    header_field: 'Institution Name',
  },
  {
    name: 'Identification',
    fields: [
      {
        name: 'Type',
        help_text: "(Driver's License, Social security, Passport, etc.)",
        type: String,
      },
      {
        name: 'ID Number',
        type: String,
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
        type: String,
      },
    ],
    quick_access_fields: [
      'Type',
    ],
    header_field: 'Type',
  },
  {
    name: 'Passwords',
    fields: [
      {
        name: 'Issuer',
        help_text: '(Website, Wifi, Device)',
        type: String,
      },
      {
        name: 'Username',
        type: String,
      },
      {
        name: 'Password',
        type: String,
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
      },
      {
        name: 'Notes',
        type: String,
      },
    ],
    quick_access_fields: [
      'Issuer',
      'Username',
      'Password',
    ],
    header_field: 'Issuer',
  },
  {
    name: 'Server Connection',
    fields: [
      {
        name: 'Name',
        type: String,
      },
      {
        name: 'Type',
        help_text: '(Database, Bastion, ec2, etc.)',
        type: String,
      },
      {
        name: 'Connection String',
        type: String,
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
      },
      {
        name: 'Notes',
        type: String,
      },
    ],
    quick_access_fields: [
      'Name',
    ],
    header_field: 'Name',
  },
  {
    name: 'Notes',
    fields: [
      {
        name: 'Name',
        type: String,
      },
      {
        name: 'Notes',
        type: 'textarea',
      },
    ],
    quick_access_fields: [
      'Name',
    ],
    header_field: 'Name',
  },
]
