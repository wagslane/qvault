import updatedField from '../src/migrations/0003updatedField';
import { expect } from 'chai';
import jsonStableStringify from '../src/lib/jsonStableStringify';

it('test migration 0.2.2 => 0.2.5', () => {
  let vault = {
    "version": "0.2.2"
  };
  let migrated_vault = {
    "version": "0.2.5"
  };
  let secrets = {
    "1cb7680e-3960-4214-9f27-9f6c2b81464b": {
      "created": 1558668426083,
      "secrets": {
        "312be9f8-6c15-4e9a-8a3f-4bee43be8ae1": {
          "created": 1558668426083,
          "fields":{
            "test": "field"
          }
        },
        "5a3e5f39-1c18-49e2-89a3-6e627ecff871": {
          "created": 1558668426083,
        },
      }
    }
  };
  let migrated_secrets = {
    "1cb7680e-3960-4214-9f27-9f6c2b81464b": {
      "updated": 1558668426083,
      "secrets": {
        "312be9f8-6c15-4e9a-8a3f-4bee43be8ae1": {
          "updated": 1558668426083,
          "fields": {
            "test": "field"
          }
        },
        "5a3e5f39-1c18-49e2-89a3-6e627ecff871": {
          "updated": 1558668426083,
        },
      }
    }
  };
  [ vault, secrets ] = updatedField(vault, secrets);
  expect(jsonStableStringify(vault)).equal(jsonStableStringify(migrated_vault));
  expect(jsonStableStringify(secrets)).equal(jsonStableStringify(migrated_secrets));
});
