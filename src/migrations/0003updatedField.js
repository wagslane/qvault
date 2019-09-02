export default function (loadedVault, decryptedSecrets) {
  for (let boxKey of Object.keys(decryptedSecrets)) {
    if (decryptedSecrets[boxKey].hasOwnProperty('created')){
      decryptedSecrets[boxKey].updated = decryptedSecrets[boxKey].created;
      delete decryptedSecrets[boxKey].created;
    }
    for (let secretKey of Object.keys(decryptedSecrets[boxKey].secrets)) {
      if (decryptedSecrets[boxKey].secrets[secretKey].hasOwnProperty('created')) {
        decryptedSecrets[boxKey].secrets[secretKey].updated = decryptedSecrets[boxKey].secrets[secretKey].created;
        delete decryptedSecrets[boxKey].secrets[secretKey].created;
      }
    }
  }
  loadedVault.version = '0.2.5';
  return [ loadedVault, decryptedSecrets ];
}
