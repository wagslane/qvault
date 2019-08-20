import m_0_2_0 from '../src/migrations/0.2.0';
import { expect } from 'chai';
import jsonStableStringify from '../src/lib/jsonStableStringify';

it('test migration 0.2.0', () => {
  let vault = {
    "version":"0.2.0"
  };
  let migrated_vault = {
    "version":"0.2.1"
  };
  let secrets = {
    "1cb7680e-3960-4214-9f27-9f6c2b81464b":{
      "name":"Custom 1",
      "type":"Other",
      "secrets":{
      },
      "created":1558668415593
    }
  };
  let migrated_secrets = {
    "1cb7680e-3960-4214-9f27-9f6c2b81464b":{
      "name":"Custom 1",
      "type":"other",
      "secrets":{
      },
      "created":1558668415593
    }
  };
  m_0_2_0(vault, secrets);
  expect(jsonStableStringify(vault)).equal(jsonStableStringify(migrated_vault));
  expect(jsonStableStringify(secrets)).equal(jsonStableStringify(migrated_secrets));
});
