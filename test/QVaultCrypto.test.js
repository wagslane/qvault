import {
  ValidatePassword,
  GeneratePassphrase,
  GenerateCharKey,
  PassKeyFromPassword,
  CipherSecrets,
  DecipherSecrets,
  GetMasterKeyNoQR,

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

it('Hashing', async () => {
  const hash1 = await PassKeyFromPassword('lanewagner');
  const hash2 = await PassKeyFromPassword('lanewagner');
  const hash3 = await PassKeyFromPassword('lanewagners');
  expect(hash1).equal(hash2);
  expect(hash1).not.equal(hash3);
});

it('DoorKey Output', async () => {
  const charKey = await GenerateCharKey();
  const hash = await GetMasterKeyNoQR(charKey);
  const buf = Buffer.from(hash, 'base64');
  expect(buf.length).equal(32);
});

it('cipher and decipher', () => {
  const mySecrets = {
    cryptocurrency: {
      someUUID: {
        coin: 'BTC',
        mnemonic: 'some random words that are super secret',
        description: 'I love q-vault'
      }
    }
  };
  const masterKey = "fhdsbf7aisduifgsdifuagsdfgsdjhfgsdjhlfashdfg";
  const ciphered = CipherSecrets(masterKey, mySecrets);
  const deciphered = DecipherSecrets(masterKey, ciphered);
  expect(mySecrets.cryptocurrency.someUUID.coin).equal(deciphered.cryptocurrency.someUUID.coin);
  expect(mySecrets.cryptocurrency.someUUID.mnemonic).equal(deciphered.cryptocurrency.someUUID.mnemonic);
  expect(mySecrets.cryptocurrency.someUUID.description).equal(deciphered.cryptocurrency.someUUID.description);
});
