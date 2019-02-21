import {
  ValidatePassword,
  ValidatePassphrase,
  GeneratePassphrase,
  GenerateCharKey,
  PassKeyFromPassword,
  CipherSecrets,
  DecipherSecrets,
  CipherSecretsQr,
  DecipherSecretsQr,
  HashCharKey,
  ValidateQRKey,
} from '../src/lib/QVaultCrypto/QVaultCrypto';
import { expect } from 'chai';

it('validate password', () => {
  expect(ValidatePassword('somewordthatslong')).not.equal('');
  expect(ValidatePassword('somewordthatslong1')).not.equal('');
  expect(ValidatePassword('somewordthatslong@1')).not.equal('');
  expect(ValidatePassword('lonG@1')).not.equal('');

  expect(ValidatePassword('somewordthatslonG@1')).equal('');
});

it('validate passphrase', () => {
  expect(ValidatePassphrase('not fifteen')).not.equal('');
  expect(ValidatePassphrase('short')).not.equal('');

  expect(ValidatePassphrase('five words od safe log')).equal('');
});

it('GeneratePassphrase', async () => {
  let passphrase = await GeneratePassphrase(5);
  passphrase = passphrase.split(" ");
  expect(passphrase.length).equal(5);
  expect(passphrase[0] !== passphrase[1]);
  expect(passphrase[0] !== undefined);
  let passphrase2 = await GeneratePassphrase(5);
  passphrase2 = passphrase2.split(" ");
  expect(passphrase).not.equal(passphrase2);
});

it('GenerateCharKey', async () => {
  for (let i = 0; i < 25; i += 1) {
    let charKey = await GenerateCharKey();
    expect(charKey.length).equal(16);
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

it('hash char key', async () => {
  const charKey = await GenerateCharKey();
  const hash = await HashCharKey(charKey);
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
  const hashedCharKey = "fhdsbf7aisduifgsdifuagsdfgsdjhfgsdjhlfashdfg";
  const qrKey = "fhdsbf7aisduifgsjifuagsdfgsdjhfgsdjhlfashdfg";
  const ciphered = CipherSecrets(hashedCharKey, mySecrets);
  const deciphered = DecipherSecrets(hashedCharKey, ciphered);
  expect(mySecrets.cryptocurrency.someUUID.coin).equal(deciphered.cryptocurrency.someUUID.coin);
  expect(mySecrets.cryptocurrency.someUUID.mnemonic).equal(deciphered.cryptocurrency.someUUID.mnemonic);
  expect(mySecrets.cryptocurrency.someUUID.description).equal(deciphered.cryptocurrency.someUUID.description);

  const dualCiphered = CipherSecretsQr(qrKey, ciphered);
  const unDualCiphered = DecipherSecretsQr(qrKey, dualCiphered);
  const totallyUnciphered = DecipherSecrets(hashedCharKey, unDualCiphered);
  expect(mySecrets.cryptocurrency.someUUID.coin).equal(totallyUnciphered.cryptocurrency.someUUID.coin);
  expect(mySecrets.cryptocurrency.someUUID.mnemonic).equal(totallyUnciphered.cryptocurrency.someUUID.mnemonic);
  expect(mySecrets.cryptocurrency.someUUID.description).equal(totallyUnciphered.cryptocurrency.someUUID.description);
});

it('Validate QRKey', () => {
  expect(ValidateQRKey('FwV6QcIGt3izSTncwGZGo7WQY53Q2fOmKW6mhNRMgNs=')).equal(true);
  expect(ValidateQRKey('FwV6QcIGt3izSTncwGZGY53Q2fOmKW6mhNRMgNs=')).equal(false);
});
