import {
  CipherSecret,
  DecipherSecret,
  GetNewMasterKey,
  HashMasterKey,
  ValidatePassword,
  HashDoorKey,
  GetMasterKeyFromCardMnemonic,
  GetMasterKeyFromCardQR
} from './QVaultCrypto';

it('deterministic master hashes', async () => {
  const hash1 = await HashMasterKey('lanewagner');
  const hash2 = await HashMasterKey('lanewagner');
  const hash3 = await HashMasterKey('lanewagners');
  expect(hash1).toEqual(hash2);
  expect(hash1).not.toEqual(hash3);
});

it('deterministic door hashes', async () => {
  const hash1 = await HashDoorKey('lanewagner', 1234);
  const hash2 = await HashDoorKey('lanewagner', 1234);
  const hash3 = await HashDoorKey('lanewagners', 5555);
  expect(hash1).toEqual(hash2);
  expect(hash1).not.toEqual(hash3);
});

it('unique keys', () => {
  const key1 = GetNewMasterKey();
  const key2 = GetNewMasterKey();
  expect(key1).not.toEqual(key2);
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
  expect(mySecret).toEqual(deciphered);
});

it('validate password', () => {
  // truthy = "not valid" because the messages mean there was an error
  expect(ValidatePassword('somewordthatslong')).toBeTruthy();
  expect(ValidatePassword('somewordthatslong1')).toBeTruthy();
  expect(ValidatePassword('somewordthatslong@1')).toBeTruthy();
  expect(ValidatePassword('lonG@1')).toBeTruthy();

  expect(ValidatePassword('somewordthatslonG@1')).toBeFalsy();
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
  expect(randomMasterKey.length).toEqual(masterKey.length);
  expect(Buffer.from(masterKey, 'base64').length).toEqual(24);
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
  expect(randomMasterKey.length).not.toEqual(masterKeyBadMnemonic.length);
  expect(randomMasterKey.length).not.toEqual(masterKeyBadPrivateCode.length);
});

it('GetMasterKeyFromCardQRSuccess', () => {
  const masterKey = GetMasterKeyFromCardQR('Y6Z46buO2GYUDdSoab6j1A==', '16UjcYNBG9');
  const randomMasterKey = GetNewMasterKey();
  expect(randomMasterKey.length).toEqual(masterKey.length);
  expect(Buffer.from(masterKey, 'base64').length).toEqual(24);
});

it('GetMasterKeyFromCardQRFail', () => {
  const masterKeyBadMnemonic = GetMasterKeyFromCardQR('Y6Z46buO2GYUDdSoab6j1==', '16UjcYNBG9');
  const masterKeyBadPrivateCode = GetMasterKeyFromCardQR('Y6Z46buO2GYUDdSoab6j1A==', '16UjcYNBG');
  const randomMasterKey = GetNewMasterKey();
  expect(randomMasterKey.length).not.toEqual(masterKeyBadMnemonic.length);
  expect(randomMasterKey.length).not.toEqual(masterKeyBadPrivateCode.length);
});
