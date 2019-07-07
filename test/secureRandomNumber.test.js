import secureRandomNumber from '../src/lib/secureRandomNumber';
import { expect } from 'chai';
  
it('secureRandomNumber', () => {
  let numOne = secureRandomNumber(0, 100000000);
  let numTwo = secureRandomNumber(0, 100000000);
  expect(numOne).not.equal(numTwo);
});

  
