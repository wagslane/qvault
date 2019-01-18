import {
  CipherSecret,
  DecipherSecret,
  GetNewMasterKey,
  HashMasterKey,
  ValidatePassword,
  HashDoorKey,
  GetMasterKeyFromCardMnemonic,
  GetMasterKeyFromCardQR,
  GeneratePassphrase
} from '../src/lib/QVaultCrypto/QVaultCrypto';
import { expect } from 'chai';

it('deterministic master hashes', async () => {
  const hash1 = await HashMasterKey('lanewagner');
  const hash2 = await HashMasterKey('lanewagner');
  const hash3 = await HashMasterKey('lanewagners');
  expect(hash1).equal(hash2);
  expect(hash1).not.equal(hash3);
});

it('deterministic door hashes', async () => {
  const hash1 = await HashDoorKey('lanewagner', 1234);
  const hash2 = await HashDoorKey('lanewagner', 1234);
  const hash3 = await HashDoorKey('lanewagners', 5555);
  expect(hash1).equal(hash2);
  expect(hash1).not.equal(hash3);
});

it('unique keys', () => {
  const key1 = GetNewMasterKey();
  const key2 = GetNewMasterKey();
  expect(key1).not.equal(key2);
});

it('cipher and decipher', async () => {
  const mySecret = {
    coin: 'BTC',
    mnemonic: 'some random words that are super secret',
    description: 'I love q-vault'
  };
  const hashedMasterKey = await HashMasterKey(GetNewMasterKey());
  const ciphered = CipherSecret(hashedMasterKey, mySecret);
  const deciphered = DecipherSecret(hashedMasterKey, ciphered);
  expect(mySecret.coin).equal(deciphered.coin);
  expect(mySecret.mnemonic).equal(deciphered.mnemonic);
  expect(mySecret.description).equal(deciphered.description);
});

it('validate password', () => {
  // truthy = "not valid" because the messages mean there was an error
  expect(ValidatePassword('somewordthatslong')).not.equal('');
  expect(ValidatePassword('somewordthatslong1')).not.equal('');
  expect(ValidatePassword('somewordthatslong@1')).not.equal('');
  expect(ValidatePassword('lonG@1')).not.equal('');

  expect(ValidatePassword('somewordthatslonG@1')).equal('');
});

it('GetMasterKeyFromCardMnemonicSuccess', () => {
  const masterKey = GetMasterKeyFromCardMnemonic(
    [
      'seed',
      'sock',
      'milk',
      'update',
      'focus',
      'rotate',
      'barely',
      'fade',
      'car',
      'face',
      'mechanic',
      'mercy'
    ],
    '16UjcYNBG9'
  );
  const randomMasterKey = GetNewMasterKey();
  expect(randomMasterKey.length).equal(masterKey.length);
  expect(Buffer.from(masterKey, 'base64').length).equal(24);
});

it('GetMasterKeyFromCardMnemonicFail', () => {
  const masterKeyBadMnemonic = GetMasterKeyFromCardMnemonic(
    [
      'seed',
      'sock',
      'milk',
      'update',
      'focus',
      'rotate',
      'barely',
      'fade',
      'car',
      'face',
      'mechanic'
    ],
    '16UjcYNBG9'
  );
  const masterKeyBadPrivateCode = GetMasterKeyFromCardMnemonic(
    [
      'seed',
      'sock',
      'milk',
      'update',
      'focus',
      'rotate',
      'barely',
      'fade',
      'car',
      'face',
      'mechanic',
      'mercy'
    ],
    '16UjcYNBG'
  );
  const randomMasterKey = GetNewMasterKey();
  expect(randomMasterKey.length).not.equal(masterKeyBadMnemonic.length);
  expect(randomMasterKey.length).not.equal(masterKeyBadPrivateCode.length);
});

it('GetMasterKeyFromCardQRSuccess', () => {
  const masterKey = GetMasterKeyFromCardQR('Y6Z46buO2GYUDdSoab6j1A==', '16UjcYNBG9');
  const randomMasterKey = GetNewMasterKey();
  expect(randomMasterKey.length).equal(masterKey.length);
  expect(Buffer.from(masterKey, 'base64').length).equal(24);
});

it('GetMasterKeyFromCardQRFail', () => {
  const masterKeyBadMnemonic = GetMasterKeyFromCardQR('Y6Z46buO2GYUDdSoab6j1==', '16UjcYNBG9');
  const masterKeyBadPrivateCode = GetMasterKeyFromCardQR('Y6Z46buO2GYUDdSoab6j1A==', '16UjcYNBG');
  const randomMasterKey = GetNewMasterKey();
  expect(randomMasterKey.length).not.equal(masterKeyBadMnemonic.length);
  expect(randomMasterKey.length).not.equal(masterKeyBadPrivateCode.length);
});

it('GeneratePassphrase', () => {
  const passphrase = GeneratePassphrase(5);
  expect(passphrase.length).equal(5);
  const passphrase2 = GeneratePassphrase(5);
  expect(passphrase).not.equal(passphrase2);
});
