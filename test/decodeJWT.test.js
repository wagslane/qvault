import decodeJWT from '../src/lib/decodeJWT';
import { expect } from 'chai';

// test vector taken from
// https://github.com/auth0/jwt-decode/blob/master/test/tests.js
const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmb28iOiJiYXIiLCJleHAiOjEzOTMyODY4OTMsImlhdCI6MTM5MzI2ODg5M30.4-iaDojEVl0pJQMjrbM1EzUIfAZgsbK_kgnVyVxFSVo';

it('decodeJWT', () => {
  const decoded = decodeJWT(token);
  expect(decoded.exp).to.equal(1393286893);
  expect(decoded.iat).to.equal(1393268893);
  expect(decoded.foo).to.equal('bar');
});

  
