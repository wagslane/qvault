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
        name: '2FA Secret',
        type: String,
      },
      {
        name: 'Password',
        type: String,
      },
      {
        name: 'Username',
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
        name: 'Notes',
        type: String,
      },
    ],
    quick_access_fields: [
      'Issuer',
      'Username',
      'Password',
    ],
  },
]
