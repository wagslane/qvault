// requires old import syntax
const bip39 = require('bip39');
const bip32 = require('bip32');

// https://github.com/satoshilabs/slips/blob/master/slip-0132.md
const ypubNetwork = {
  bip32: {
    public: 0x049d7cb2,
    private: 0x049d7878
  },
  wif: 0x80
};

// https://github.com/satoshilabs/slips/blob/master/slip-0132.md
const zpubNetwork = {
  bip32: {
    public: 0x04b24746,
    private: 0x04b2430c
  },
  wif: 0x80
};

export function generateMnemonic() {
  return bip39.generateMnemonic(256, window.nodeAPI.crypto.randomBytes);
}

export async function mnemonicToXPub(mnemonic,  account) {
  validateAccountNumber(account);
  validateMnemonic(mnemonic);
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const hd = bip32.fromSeed(seed);
  return hd.derivePath(`m/44'/0'/${account}'`).neutered().toBase58();
}

export async function mnemonicToYPub(mnemonic, account) {
  validateAccountNumber(account);
  validateMnemonic(mnemonic);
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const hd = bip32.fromSeed(seed, ypubNetwork);
  return hd.derivePath(`m/49'/0'/${account}'`).neutered().toBase58();
}

export async function mnemonicToZPub(mnemonic, account) {
  validateAccountNumber(account);
  validateMnemonic(mnemonic);
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const hd = bip32.fromSeed(seed, zpubNetwork);
  return hd.derivePath(`m/84'/0'/${account}'`).neutered().toBase58();
}

// throws an error if the account number isn't valid
function validateAccountNumber(account) {
  if (!Number.isInteger(account)) {
    throw 'Account must be a number';
  }
  const minAccount = 0;
  const maxAccount = 100000000000;
  if (account < minAccount || account > maxAccount) {
    throw `Account number must be between ${minAccount} and ${maxAccount}`;
  }
}

// throws an error if the mnemonic isn't valid
function validateMnemonic(mnemonic) {
  if (mnemonic.split(' ').length !== 24) {
    throw 'Mnemonic is invalid';
  }
}
