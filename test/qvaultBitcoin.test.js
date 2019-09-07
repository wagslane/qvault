import { generateMnemonic, mnemonicToXPub, mnemonicToYPub, mnemonicToZPub } from '../src/lib/qvaultBitcoin';
import { expect } from 'chai';

it('generateMnemonic', () => {
  const mnemonic1 = generateMnemonic();
  const mnemonic2 = generateMnemonic();
  expect(mnemonic1).not.equal(mnemonic2);
  expect(mnemonic1.split(' ').length).equal(24);
  expect(mnemonic2.split(' ').length).equal(24);
});

// Test vectors from https://iancoleman.io/bip39/
it('mnemonicToXPub', async () => {
  const mnemonic = 'arrow cool cliff electric worth define bomb brush suggest gravity vacuum grab scare birth capital math next rotate shallow field cash gain talk world';
  const xpub = await mnemonicToXPub(mnemonic, 0);
  expect(xpub).equal('xpub6CP6TKkxdqVFsW3R1PWXwGZaj8NmdHAbYyFkZqahGKBFQPUEuqDqVAhhhTzgqdcfftTFLcX3BoD9Db6Yfj8pjgbtn7WVHgJ9gAxtrM54SnX');

  const xpub2 = await mnemonicToXPub(mnemonic, 156156);
  expect(xpub2).equal('xpub6CP6TKkxdsXZxRRf6KpJWerAigzbMJDzDFnuA7cEEW6dPnVSGcu5BQrdKYAVjCof6pdpehRrbAnaYTtodjHx46SJP3HvZS9Ua45hEzYWN5j');
});

it('mnemonicToYPub', async () => {
  const mnemonic = 'arrow cool cliff electric worth define bomb brush suggest gravity vacuum grab scare birth capital math next rotate shallow field cash gain talk world';
  const ypub = await mnemonicToYPub(mnemonic, 0);
  expect(ypub).equal('ypub6XEx48sDemHvsCpP2vCYMF1gifNT1oqtGLjK2hoY2DJDDJNncu4n63d7t4ZQxoY9RfBVrQUkQNNhvB8VrxGsTLA8aYdCEJQpnNsAzhdvJfF');

  const ypub2 = await mnemonicToYPub(mnemonic, 156156);
  expect(ypub2).equal('ypub6XEx48sDeoLExRSPgwezAx9ViQ6XsN5JbdZwjmLbWkgsLFADi6GJ77749ZPTzNJddj2bXAMGzgtHvG67Ujz7q9KpCAVNE5VL8MpBBKm9N6Z');
});

it('mnemonicToZPub', async () => {
  const mnemonic = 'arrow cool cliff electric worth define bomb brush suggest gravity vacuum grab scare birth capital math next rotate shallow field cash gain talk world';
  const ypub = await mnemonicToZPub(mnemonic, 0);
  expect(ypub).equal('zpub6qwqLcQboxWWC1Rh634QVyaSgAuD1eooB6UQ3MtfZcvz9wLih8a5tqxiDRjTzAn46D9AcsHEm2XmU3aQ7jJuGEJ1EQWppXJqtzMRYUtkEm9');

  const ypub2 = await mnemonicToZPub(mnemonic, 156156);
  expect(ypub2).equal('zpub6qwqLcQbozYpJp54rA5o1hUsNYGNTTKLTwjPTtbUfbWf85MeCCNLMRhMw3AA7MngaRnFX5ZCLcWT5baBHjV8BH6prSRoFbcQYuUJMXHxgF6');
});
