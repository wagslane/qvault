const crypto = require('crypto');
const randomNumber = require("random-number-csprng");
const BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

import WordList from './WordList';

const cipherAlgo = 'aes-256-gcm';
const encodingFormat = 'base64';
const textFormat = 'utf8';

const longHashDifficulty = 17;
const shortHashDifficulty = 10;

// QR Key (256 bit, base64) = Encoded in the QR Card, generated in QVault factory
// Char Key (15 chars, base58) = Back of the Q-Card, generated randomly by this app
// Pass Key (256 bit, base 64) = Hash(password) or Hash(passphrase), used to cipher the Char Key for easy access
// Master Key (256 bit, base 64) = Hash(Char Key) OR Hash(Char Key + QR Key), used to cipher the master key

// (string) => string
// returns '' if no error, else an error message is returned
// At least: length 10, 1 upper, 1 lower, 1 number, 1 special char
// log2(70^12) = 73.6 bits of entropy 
export function ValidatePassword(password) {
  if (password.length < 12) {
    return 'Password must have at least 12 characters';
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

export function ValidatePassphrase(passphrase) {
  const minLength = 15;
  if (passphrase.length < minLength){
    return `Passphrase must have at least ${minLength} characters`;
  }
  return '';
}

// (int) => Promise(string)
// log2(20000 ^ 5) = 71.5 bits entropy
// log2(20000 ^ 6) = 85.7 bits entropy
// log2(20000 ^ 7) = 100 bits entropy
export async function GeneratePassphrase(phraseLength) {
  let phrase = [];
  for (let i = 0; i < phraseLength; i++) {
    let index = await randomNumber(0, WordList.length - 1);
    phrase.push(WordList[index]);
  }
  return phrase.join(" ");
}

// () => Promise(string)
export async function GenerateCharKey() {
  // log2(58^15) = 88.9 bits entropy
  // log2(58^20) = 117.2 bits entropy
  // log2(58^25) = 146 bits entropy
  const length = 16;

  let key = '';
  for (let i = 0; i < length; i++) {
    let index = await randomNumber(0, BASE58.length - 1);
    key += BASE58.charAt(index);
  }
  return key;
}

// (string) => Promise(string)
export function PassKeyFromPassword(password) {
  return hashString(password, longHashDifficulty);
}

// string => Promise(string)
export function GetMasterKeyNoQR(charKey) {
  return hashString(charKey, longHashDifficulty);
}

// (string, string) => Promise(string)
export function GetMasterKeyQR(charKey, qrKey) {
  return hashString(charKey + qrKey, longHashDifficulty);
}

// string => Promise(string)
export function DeriveCloudKey(passKey) {
  const cloudSalt = '-cloud-salt';
  return hashString(passKey + cloudSalt, shortHashDifficulty);
}

// (string, string) => string
export function CipherCharKey(passKey, charKey) {
  return cipherString(passKey, charKey);
}

// (string, string) => string
export function DecipherCharKey(passKey, cipheredCharKey) {
  return decipherString(passKey, cipheredCharKey);
}

// (string, obj) => string
export function CipherSecrets(masterKey, secrets) {
  const secretsString = JSON.stringify(secrets);
  return cipherString(masterKey, secretsString);
}

// (string, string) => obj
export function DecipherSecrets(masterKey, cipheredSecrets) {
  const deciphered = decipherString(masterKey, cipheredSecrets);
  return JSON.parse(deciphered);
}

// (string) => bool
export function ValidateQRKey(qrKey) {
  const keyBuf = Buffer.from(qrKey, encodingFormat);
  return keyBuf.length === 32;
}

function hashString(data, difficulty) {
  const scryptSalt = 'qvaultsalthopefullyusednowhereelse';
  const scryptKeyLenBytes = 32;
  const scryptCost = Math.pow(2, difficulty);
  const scryptBlockSize = 8;
  const scryptOptions = {
    cost: scryptCost,
    blockSize: scryptBlockSize,
    maxmem: scryptCost * scryptBlockSize * 256
  };

  return new Promise(function (resolve) {
    const hash = crypto.scryptSync(data, scryptSalt, scryptKeyLenBytes, scryptOptions);
    resolve(hash.toString(encodingFormat));
  });
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
