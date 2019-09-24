export default function (loadedVault, decryptedSecrets) {
  for (let boxKey of Object.keys(decryptedSecrets)) {
    for (let secretKey of Object.keys(decryptedSecrets[boxKey].secrets)) {
      decryptedSecrets[boxKey].secrets[secretKey].fields =
        replaceFields(decryptedSecrets[boxKey].secrets[secretKey].fields);
    }
  }
  loadedVault.version = '0.2.8';
  return [ loadedVault, decryptedSecrets ];
}

function replaceFields(fields){
  let fieldsCopy = JSON.parse(JSON.stringify(fields));
  for (let fieldName of Object.keys(fieldsCopy)) {
    if (fieldName in fieldsMap) {
      // assign new key
      fieldsCopy[fieldsMap[fieldName]] = fieldsCopy[fieldName];

      // delete old key
      delete fieldsCopy[fieldName];

      // apply to subfields as well
      if (Array.isArray(fieldsCopy[fieldsMap[fieldName]])){
        fieldsCopy[fieldsMap[fieldName]] = replaceSubfields(fieldsCopy[fieldsMap[fieldName]]);
      }
    } else {
      throw `Unsupported field ${fieldName} found when migrating 0004`;
    }
  }
  return fieldsCopy;
}

function replaceSubfields(subfields) {
  let subfieldsCopy = JSON.parse(JSON.stringify(subfields));
  for (let i = 0; i < subfieldsCopy.length; i++) {
    for (let fieldName of Object.keys(subfieldsCopy[i])) {
      if (fieldName in fieldsMap) {
        // assign new key
        subfieldsCopy[i][fieldsMap[fieldName]] = subfieldsCopy[i][fieldName];

        // delete old key
        delete subfieldsCopy[i][fieldName];
      } else {
        throw `Unsupported field ${fieldName} found when migrating 0004`;
      } 
    }
  }
  return subfieldsCopy;
}

const fieldsMap = {
  'Wallet Name': 'walletName',
  'Ticker': 'ticker',
  'Seed': 'seed',
  'Password': 'password',
  'XPub': 'xpub',
  'YPub': 'ypub',
  'ZPub': 'zpub',
  'Key/Seed': 'seed',
  'PIN': 'pin',
  'Notes': 'notes',
  'Institution Name': 'institutionName',
  'Username': 'username',
  'Email': 'email',
  'Routing Number': 'routingNumber',
  'Payment Cards': 'paymentCards',
  'Expiration Date': 'expirationDate',
  'CVC': 'cvc',
  'Card Number': 'cardNumber',
  'Loans': 'loans',
  'Name': 'name',
  'Loan Number': 'loanNumber',
  'Due Date': 'dueDate',
  'Account Numbers': 'accountNumbers',
  'Account Number': 'accountNumber',
  'Identification': 'identification',
  'Type': 'type',
  'ID Number': 'idNumber',
  'Issuer': 'issuer',
  'Link': 'link',
  '2FA Secret': '2faSecret',
  'Server Connection': 'serverConnection',
  'Connection String': 'connectionString',
  'Hostname': 'hostname',
  'Port': 'port',
  'Alias': 'alias',
  'Public Key': 'publicKey',
  'Private Key': 'privateKey',
  'Secret': 'secret'
};
