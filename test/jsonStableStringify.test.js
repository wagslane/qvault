import jsonStableStringify from '../src/lib/jsonStableStringify';
import { expect } from 'chai';
  
it('nested jsonStableStringify', () => {
  const obj = { c: 8, b: [ {z:6,y:5,x:4},7 ], a: 3 };
  expect(jsonStableStringify(obj)).equal('{"a":3,"b":[{"x":4,"y":5,"z":6},7],"c":8}');
});

it('alphabetical jsonStableStringify', () => {
  let vault = {
    salt: 'salt',
    version: 'v0.2.1',
    key: 'fknsfnsdlfnsfksdbffksdfkssdafndf=',
    secrets: 'dfaidsfbsdlfbsdfkjsdfsadkfbsfklsdf==',
    qr_required: false,
    email: 'no-exist@qvault.io',
    cloud_vault_hash: 'fsdjkbfsdlkjfbsldfsdf==',
  };
  expect(jsonStableStringify(vault)).equal('{"cloud_vault_hash":"fsdjkbfsdlkjfbsldfsdf==","email":"no-exist@qvault.io","key":"fknsfnsdlfnsfksdbffksdfkssdafndf=","qr_required":false,"salt":"salt","secrets":"dfaidsfbsdlfbsdfkjsdfsadkfbsfklsdf==","version":"v0.2.1"}');
});
