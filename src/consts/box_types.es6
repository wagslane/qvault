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
        name: 'Institution Name',
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
  },
]
