import m_0_1_6 from '../src/migrations/0.1.6';
import { expect } from 'chai';

it('test migration 0.1.6', () => {
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
  m_0_1_6(vault, secrets);
  expect(JSON.stringify(vault)).equal(JSON.stringify(migrated_vault));
  expect(JSON.stringify(secrets)).equal(JSON.stringify(migrated_secrets));
});
