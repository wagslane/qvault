import fieldsKey from './0001fieldsKey';
import typeCamelCase from './0002typeCamelCase';

import semver from 'semver';

let migrationMapping = {
  '<0.2.0': fieldsKey,
  '0.2.0': typeCamelCase,
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
