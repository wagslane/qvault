import { 
  generateMnemonic,
  mnemonicToXPubBTC,
  mnemonicToYPubBTC,
  mnemonicToZPubBTC,
  mnemonicToXPubBCH,
} from '../src/lib/qvaultBitcoin';
import { expect } from 'chai';

it('generateMnemonic', () => {
  const mnemonic1 = generateMnemonic();
  const mnemonic2 = generateMnemonic();
  expect(mnemonic1).not.equal(mnemonic2);
  expect(mnemonic1.split(' ').length).equal(24);
  expect(mnemonic2.split(' ').length).equal(24);
});

// Test vectors from https://iancoleman.io/bip39/
it('mnemonicToXPubBTC', async () => {
  const mnemonic = 'arrow cool cliff electric worth define bomb brush suggest gravity vacuum grab scare birth capital math next rotate shallow field cash gain talk world';
  const xpub = await mnemonicToXPubBTC(mnemonic, 0);
  expect(xpub).equal('xpub6CP6TKkxdqVFsW3R1PWXwGZaj8NmdHAbYyFkZqahGKBFQPUEuqDqVAhhhTzgqdcfftTFLcX3BoD9Db6Yfj8pjgbtn7WVHgJ9gAxtrM54SnX');

  const xpub2 = await mnemonicToXPubBTC(mnemonic, 156156);
  expect(xpub2).equal('xpub6CP6TKkxdsXZxRRf6KpJWerAigzbMJDzDFnuA7cEEW6dPnVSGcu5BQrdKYAVjCof6pdpehRrbAnaYTtodjHx46SJP3HvZS9Ua45hEzYWN5j');
});

it('mnemonicToYPubBTC', async () => {
  const mnemonic = 'arrow cool cliff electric worth define bomb brush suggest gravity vacuum grab scare birth capital math next rotate shallow field cash gain talk world';
  const ypub = await mnemonicToYPubBTC(mnemonic, 0);
  expect(ypub).equal('ypub6XEx48sDemHvsCpP2vCYMF1gifNT1oqtGLjK2hoY2DJDDJNncu4n63d7t4ZQxoY9RfBVrQUkQNNhvB8VrxGsTLA8aYdCEJQpnNsAzhdvJfF');

  const ypub2 = await mnemonicToYPubBTC(mnemonic, 156156);
  expect(ypub2).equal('ypub6XEx48sDeoLExRSPgwezAx9ViQ6XsN5JbdZwjmLbWkgsLFADi6GJ77749ZPTzNJddj2bXAMGzgtHvG67Ujz7q9KpCAVNE5VL8MpBBKm9N6Z');
});

it('mnemonicToZPubBTC', async () => {
  const mnemonic = 'arrow cool cliff electric worth define bomb brush suggest gravity vacuum grab scare birth capital math next rotate shallow field cash gain talk world';
  const ypub = await mnemonicToZPubBTC(mnemonic, 0);
  expect(ypub).equal('zpub6qwqLcQboxWWC1Rh634QVyaSgAuD1eooB6UQ3MtfZcvz9wLih8a5tqxiDRjTzAn46D9AcsHEm2XmU3aQ7jJuGEJ1EQWppXJqtzMRYUtkEm9');

  const ypub2 = await mnemonicToZPubBTC(mnemonic, 156156);
  expect(ypub2).equal('zpub6qwqLcQbozYpJp54rA5o1hUsNYGNTTKLTwjPTtbUfbWf85MeCCNLMRhMw3AA7MngaRnFX5ZCLcWT5baBHjV8BH6prSRoFbcQYuUJMXHxgF6');
});

it('mnemonicToXPubBCH', async () => {
  const mnemonic = 'arrow cool cliff electric worth define bomb brush suggest gravity vacuum grab scare birth capital math next rotate shallow field cash gain talk world';
  const xpub = await mnemonicToXPubBCH(mnemonic, 0);
  expect(xpub).equal('xpub6CwN5EKrohtVD8oUKTkEWiRVr1gY3hdgm9DWgZz9pzsEA3wNLuBiEDu1zKt2hPCVyArJrzkspVZtFD4dXb9eugWiD2GFAN2Tf8k9MtGsNwU');

  const xpub2 = await mnemonicToXPubBCH(mnemonic, 156156);
  expect(xpub2).equal('xpub6CwN5EKrojvoHaDRE4txJSEYJZkrjFb2Ri4wmKUsJHaKxH7Gfs8C7g5ZKs2Cxcjw6XWmfgekLHCFq1E1o1UGaDwitGgqem3avkLNsA3aL6x');
});
