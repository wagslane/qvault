import {
  ValidatePassword,
  ValidatePassphrase,
  GeneratePassphrase,
  GenerateCharKey,
  GenerateQRKey,
  GenerateRandomSalt,
  PassKeyFromPassword,
  CipherSecrets,
  DecipherSecrets,
  CipherSecretsQr,
  DecipherSecretsQr,
  HashCharKey,
  HashCloudVault,
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

it('validate qr key', () =>{
  // 128 bit key
  expect(ValidateQRKey("xKjFos6jjaiqGtqpC4A5zA==")).equal(true);
  // 256 bit key
  expect(ValidateQRKey("pctwWwYQzB2GWrAioixQz/BWv05dNBWqUl1EelePkDg=")).equal(true);
  // 136 bit key
  expect(ValidateQRKey("3IlaK/wuwWQQXlK29YQsLj0=")).equal(false);
});

it('GeneratePassphrase', () => {
  let passphrase = GeneratePassphrase(5);
  passphrase = passphrase.split(" ");
  expect(passphrase.length).equal(5);
  expect(passphrase[0] !== passphrase[1]);
  expect(passphrase[0] !== undefined);
  let passphrase2 = GeneratePassphrase(5);
  passphrase2 = passphrase2.split(" ");
  expect(passphrase).not.equal(passphrase2);
});

it('GenerateQRKey', () => {
  for (let i = 0; i < 25; i += 1) {
    const qrKey = GenerateQRKey();
    const buf = window.nodeAPI.Buffer.from(qrKey, 'base64');
    expect(buf.length).equal(32);
    const qrKey2 = GenerateQRKey();
    expect(qrKey).not.equal(qrKey2);
  }
});

it('GenerateCharKey', () => {
  for (let i = 0; i < 25; i += 1) {
    const charKey = GenerateCharKey();
    expect(charKey.length).equal(16);
    const charKey2 = GenerateCharKey();
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
  const charKey = GenerateCharKey();
  const hash = await HashCharKey(charKey);
  const buf = window.nodeAPI.Buffer.from(hash, 'base64');
  expect(buf.length).equal(32);
});

it('cipher and decipher', async () => {
  const mySecrets = {
    cryptocurrency: {
      someUUID: {
        coin: 'BTC',
        mnemonic: 'some random words that are super secret',
        description: 'I love q-vault'
      }
    }
  };
  const charKey = GenerateCharKey();
  const hashedCharKey = await HashCharKey(charKey);
  const qrKey = "fhdsbf7aisduifgsjifuagsdfgsdjhfgsdjhlfashdfg";
  const ciphered = CipherSecrets(hashedCharKey, mySecrets);
  const deciphered = DecipherSecrets(hashedCharKey, ciphered);
  expect(mySecrets.cryptocurrency.someUUID.coin).equal(deciphered.cryptocurrency.someUUID.coin);
  expect(mySecrets.cryptocurrency.someUUID.mnemonic).equal(deciphered.cryptocurrency.someUUID.mnemonic);
  expect(mySecrets.cryptocurrency.someUUID.description).equal(deciphered.cryptocurrency.someUUID.description);

  const dualCiphered = await CipherSecretsQr(qrKey, ciphered);
  const unDualCiphered = await DecipherSecretsQr(qrKey, dualCiphered);
  const totallyUnciphered = DecipherSecrets(hashedCharKey, unDualCiphered);
  expect(mySecrets.cryptocurrency.someUUID.coin).equal(totallyUnciphered.cryptocurrency.someUUID.coin);
  expect(mySecrets.cryptocurrency.someUUID.mnemonic).equal(totallyUnciphered.cryptocurrency.someUUID.mnemonic);
  expect(mySecrets.cryptocurrency.someUUID.description).equal(totallyUnciphered.cryptocurrency.someUUID.description);
});

it('checkhash', async () => {
  let jsonData = {
    version: "0.0.32",
    secrets: "dfdfdfgjkfsdlfgslfjhbfkdvnmxcnvdfkgdkgdfngdjf",
    cloud_vault_hash: "previous_hash_here",
  };
  // same test data as server
  expect(await HashCloudVault(jsonData)).equal('d2a029d934083471e6d41ddf12c79c8ea2b6b579d8a40dd24a25d7537e688d4f');
});

it('generateRandomSalt', async () => {
  let one = await GenerateRandomSalt();
  let two = await GenerateRandomSalt();
  expect(one).not.equal(two);
});
