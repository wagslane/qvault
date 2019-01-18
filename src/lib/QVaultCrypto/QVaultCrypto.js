const crypto = require('crypto');
const bip39 = require('bip39');
const bs58 = require('bs58');

const cipherAlgo = 'aes-256-gcm';
const encodingFormat = 'base64';
const textFormat = 'utf8';

const masterKeyEntropyBytes = 24;

// (string) => string
// returns '' if no error, else an error message is returned
// At least: length 10, 1 upper, 1 lower, 1 number, 1 special char
export function ValidatePassword(password) {
  if (password.length < 10) {
    return 'Password must have at least 10 characters';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain a number';
  }
  if (!/[!@#$%^&*]/.test(password)) {
    return 'Password must contain a special character';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain a lowercase letter';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain a capital letter';
  }
  if (!/^[a-zA-Z0-9!@#$%^&*]+$/.test(password)) {
    return 'Password can only contain letters, numbers, and the following characters: ! @ # $ % ^ & *';
  }
  return '';
}

// (string, int) => Promise(string)
export function HashDoorKey(password, pin) {
  return hashString(password + pin.toString());
}

// (string) => Promise(string)
export function HashMasterKey(masterKey) {
  return hashString(masterKey);
}

function hashString(data) {
  const scryptSalt = 'nosalt';
  const scryptKeyLen = 128;
  const scryptCost = Math.pow(2, 17);
  const scryptBlockSize = 8;
  const scryptOptions = {
    cost: scryptCost,
    blockSize: scryptBlockSize,
    maxmem: scryptCost * scryptBlockSize * 256
  };

  return new Promise(function (resolve) {
    const hash = crypto.scryptSync(data, scryptSalt, scryptKeyLen, scryptOptions);
    resolve(hash.toString(textFormat));
  });
}

// (string, obj) => string
export function CipherSecret(hashedMasterKey, secret) {
  const secretString = JSON.stringify(secret);
  return cipherString(hashedMasterKey, secretString);
}

// (string, string) => obj
export function DecipherSecret(hashedMasterKey, cipheredSecret) {
  const deciphered = decipherString(hashedMasterKey, cipheredSecret);
  return JSON.parse(deciphered);
}

// (string, string) => string
export function CipherHashedMasterKey(hashedDoorKey, hashedMasterKey) {
  return cipherString(hashedDoorKey, hashedMasterKey);
}

// (string, string) => string
export function DecipherHashedMasterKey(hashedDoorKey, cipheredHashedMasterKey) {
  return decipherString(hashedDoorKey, cipheredHashedMasterKey);
}

function cipherString(key, data) {
  const keyCopy = Buffer.from(key, textFormat).slice(0, 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(cipherAlgo, keyCopy, iv);
  const cipheredSecretSection = Buffer.concat([ cipher.update(data, textFormat), cipher.final() ]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([ iv, tag, cipheredSecretSection ]).toString(encodingFormat);
}

function decipherString(key, cipheredData) {
  const keyCopy = Buffer.from(key, textFormat).slice(0, 32);
  const rawCiphered = Buffer.from(cipheredData, encodingFormat);
  const iv = rawCiphered.slice(0, 16);
  const tag = rawCiphered.slice(16, 32);
  const cipheredSecretSection = rawCiphered.slice(32);
  const decipher = crypto.createDecipheriv(cipherAlgo, keyCopy, iv);
  decipher.setAuthTag(tag);
  return decipher.update(cipheredSecretSection, 'binary', textFormat) + decipher.final(textFormat);
}

// () => string
export function GetNewMasterKey() {
  return crypto.randomBytes(masterKeyEntropyBytes).toString(encodingFormat);
}

// ([]string, string)) => string
// returns '' if not valid
export function GetMasterKeyFromCardMnemonic(mnemonicArray, privateCode) {
  if (mnemonicArray.length !== 12) {
    return '';
  }
  const mnemonic = mnemonicArray.join(' ');
  const valid = bip39.validateMnemonic(mnemonic);
  if (!valid) {
    return '';
  }
  const mnemonicHex = bip39.mnemonicToEntropy(mnemonic);
  const mnemonicBytes = Buffer.from(mnemonicHex, 'hex').slice(0, 16);
  const privateCodeBytes = bs58.decode(privateCode);
  const allBytes = Buffer.concat([ mnemonicBytes, privateCodeBytes ]);
  if (allBytes.length !== masterKeyEntropyBytes) {
    return '';
  }
  return allBytes.toString(encodingFormat);
}

// (string, string)) => string
// returns '' if not valid
export function GetMasterKeyFromCardQR(base64QR, privateCode) {
  const qrBytes = Buffer.from(base64QR, encodingFormat);
  const privateCodeBytes = bs58.decode(privateCode);
  const allBytes = Buffer.concat([ qrBytes, privateCodeBytes ]);
  if (allBytes.length !== masterKeyEntropyBytes) {
    return '';
  }
  return allBytes.toString(encodingFormat);
}
