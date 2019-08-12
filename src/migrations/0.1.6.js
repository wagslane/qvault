export default function(loadedVault, decryptedSecrets){
  for(let box of Object.values(decryptedSecrets)){
    for(let secret of Object.values(box.secrets)) {
      let fields = {};
      for (let fieldKey of Object.keys(secret)){
        if (fieldKey !== 'created') {
          fields[ fieldKey ] = secret[ fieldKey ];
          delete secret[ fieldKey ];
        }
        secret.fields = fields;
      }
    }
  }
  loadedVault.version = '0.2.0';
  return [ loadedVault, decryptedSecrets ];
}
