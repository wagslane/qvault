import m_0_1_6 from './0.1.6';

function getNullMigration(toVersion){
  return function(loadedVault, decryptedSecrets){
    loadedVault.version = toVersion;
    return [ loadedVault, decryptedSecrets ];
  };
}

export default {
  '0.1.5': getNullMigration('0.1.6'),
  '0.1.6': m_0_1_6,
};
