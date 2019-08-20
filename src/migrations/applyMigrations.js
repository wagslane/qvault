import m_0_1_6 from './0.1.6';
import m_0_2_0 from './0.2.0';

import semver from 'semver';

function getNullMigration(toVersion){
  return function(loadedVault, decryptedSecrets){
    loadedVault.version = toVersion;
    return [ loadedVault, decryptedSecrets ];
  };
}

let migrationMapping = {
  '<0.1.6': getNullMigration('0.1.6'),
  '0.1.6': m_0_1_6,
  '0.2.0': m_0_2_0,
};

function nextMigration(version){
  return Object.keys(migrationMapping).find(
    migrationKey => semver.satisfies(version, migrationKey)
  );
}

export default function applyMigrations(loadedVault, decryptedSecrets){
  while(nextMigration(loadedVault.version)){
    let migration = migrationMapping[nextMigration(loadedVault.version)];
    [ loadedVault, decryptedSecrets ] = migration(loadedVault, decryptedSecrets);
  }
  return [ loadedVault, decryptedSecrets ];
}
