const pjson = require('../../package.json');

const nameChanges = {
  'Cryptocurrency': 'cryptocurrency',
  'Financial Institution': 'financialInstitution',
  'Identification': 'identification',
  'Passwords': 'passwords',
  'Server Connection': 'serverConnection',
  'Notes': 'notes',
  'Other': 'other',
};

export default function(loadedVault, decryptedSecrets){
  for(let box of Object.values(decryptedSecrets)){
    box['type'] = nameChanges[box['type']];
  }
  loadedVault.version = pjson.version;
  return [ loadedVault, decryptedSecrets ];
}
