import fieldsKey from './0001fieldsKey';
import typeCamelCase from './0002typeCamelCase';
import updatedField from './0003updatedField';
import fieldKey from './0004fieldKey';

import semver from 'semver';

let migrationMapping = {
  '<0.2.0': fieldsKey,
  '0.2.0': typeCamelCase,
  '0.2.1 - 0.2.4': updatedField,
  '0.2.5 - 0.2.7': fieldKey,
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
