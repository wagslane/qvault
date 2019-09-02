import fieldsKey from '../src/migrations/0001fieldsKey';
import { expect } from 'chai';
import jsonStableStringify from '../src/lib/jsonStableStringify';

it('test migration <0.2.0 => 0.2.0', () => {
  let vault = {
    "version":"0.1.6"
  };
  let migrated_vault = {
    "version":"0.2.0"
  };
  let secrets = {
    "1cb7680e-3960-4214-9f27-9f6c2b81464b":{
      "name":"Custom 1",
      "type":"Other",
      "secrets":{
        "312be9f8-6c15-4e9a-8a3f-4bee43be8ae1":{
          "created":1558668426083,
          "Name":"test2",
          "Secret":"asdfgabrfdagvfas",
          "Notes":null
        }
      },
      "created":1558668415593
    }
  };
  let migrated_secrets = {
    "1cb7680e-3960-4214-9f27-9f6c2b81464b":{
      "name":"Custom 1",
      "type":"Other",
      "secrets":{
        "312be9f8-6c15-4e9a-8a3f-4bee43be8ae1":{
          "created":1558668426083,
          "fields": {
            "Name":"test2",
            "Secret":"asdfgabrfdagvfas",
            "Notes":null
          }
        }
      },
      "created":1558668415593
    }
  };
  [ vault, secrets ] = fieldsKey(vault, secrets);
  expect(jsonStableStringify(vault)).equal(jsonStableStringify(migrated_vault));
  expect(jsonStableStringify(secrets)).equal(jsonStableStringify(migrated_secrets));
});
