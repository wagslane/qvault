import {
  ValidatePassword,
  GeneratePassphrase,
  GenerateCharKey,
  GenerateMasterKey,
  PassKeyFromPassword,
  CloudKeyFromMaster,
  CipherSecret,
  DecipherSecret,

} from '../src/lib/QVaultCrypto/QVaultCrypto';
import { expect } from 'chai';

it('validate password', () => {
  expect(ValidatePassword('somewordthatslong')).not.equal('');
  expect(ValidatePassword('somewordthatslong1')).not.equal('');
  expect(ValidatePassword('somewordthatslong@1')).not.equal('');
  expect(ValidatePassword('lonG@1')).not.equal('');

  expect(ValidatePassword('somewordthatslonG@1')).equal('');
});

it('GeneratePassphrase', async () => {
  const passphrase = await GeneratePassphrase(5);
  expect(passphrase.length).equal(5);
  expect(passphrase[0] !== passphrase[1]);
  expect(passphrase[0] !== undefined);
  const passphrase2 = await GeneratePassphrase(5);
  expect(passphrase).not.equal(passphrase2);
});

it('GenerateCharKey', async () => {
  for (let i = 0; i < 25; i += 1) {
    let charKey = await GenerateCharKey();
    expect(charKey.length).equal(15);
    let charKey2 = await GenerateCharKey();
    expect(charKey).not.equal(charKey2);
  }
});

it('GenerateMasterKey', () => {
  const key1 = GenerateMasterKey();
  const key2 = GenerateMasterKey();
  expect(key1).not.equal(key2);
});

it('Hashing', async () => {
  const hash1 = await PassKeyFromPassword('lanewagner');
  const hash2 = await PassKeyFromPassword('lanewagner');
  const hash3 = await PassKeyFromPassword('lanewagners');
  expect(hash1).equal(hash2);
  expect(hash1).not.equal(hash3);
});

it('Cloud Key Hash', async () => {
  const masterKey = GenerateMasterKey();
  const hash1 = await CloudKeyFromMaster(masterKey);
  const hash2 = await PassKeyFromPassword(masterKey);
  expect(hash1).not.equal(hash2);
});

it('cipher and decipher', () => {
  const mySecret = {
    coin: 'BTC',
    mnemonic: 'some random words that are super secret',
    description: 'I love q-vault'
  };
  const masterKey = GenerateMasterKey();
  const ciphered = CipherSecret(masterKey, mySecret);
  const deciphered = DecipherSecret(masterKey, ciphered);
  expect(mySecret.coin).equal(deciphered.coin);
  expect(mySecret.mnemonic).equal(deciphered.mnemonic);
  expect(mySecret.description).equal(deciphered.description);
});
