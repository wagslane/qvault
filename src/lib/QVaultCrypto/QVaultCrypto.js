import crypto from 'crypto';
import randomNumber from 'random-number-csprng';
const BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

import WordList from './WordList';

const cipherAlgo = 'aes-256-gcm';
const encodingFormat = 'base64';
const textFormat = 'utf8';

const longHashDifficulty = 17;
const shortHashDifficulty = 10;

// QR Key (128 bit, base64) = Encoded in the QR Card, generated in QVault factory
// Char Key (15 chars, base58) = Back of the Q-Card, generated randomly by this app
// Pass Key (256 bit, base 64) = Hash(password) or Hash(passphrase), used to cipher the Char Key for easy access

// Secrets are ciphered using Cipher(Hash(Char Key), data) 
// Or
// Cipher(Hash(QRKey), Cipher(Hash(CharKey), data))

// (string) => string
// log2(70^12) = 73.6 bits of entropy 
export function ValidatePassword(password) {
  if (!/^[a-zA-Z0-9!@#$%^&*]+$/.test(password)) {
    return 'Password can only contain letters, numbers, and the following characters: ! @ # $ % ^ & *';
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
  if (password.length < 12) {
    return 'Password must have at least 12 characters';
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

export async function PassKeyFromPassword(password) {
  return await hashString(password, longHashDifficulty);
}

export async function HashCharKey(charKey) {
  return await hashString(charKey, longHashDifficulty);
}

export async function HashCloudVault(message) {
  return crypto.createHash('sha256').update(message).digest('hex');
}

export async function DeriveCloudKey(passKey) {
  const cloudSalt = '-cloud-salt';
  return await hashString(passKey + cloudSalt, shortHashDifficulty);
}

export function CipherCharKey(passKey, charKey) {
  return cipherString(passKey, charKey);
}

export function DecipherCharKey(passKey, cipheredCharKey) {
  try{
    return decipherString(passKey, cipheredCharKey);
  } catch (err){
    throw 'Invalid password';
  }
}

export function CipherSecrets(hashedCharKey, secrets) {
  const secretsString = JSON.stringify(secrets);
  return cipherString(hashedCharKey, secretsString);
}

export async function CipherSecretsQr(qrKey, cipheredSecrets){
  const hashed = await hashString(qrKey, shortHashDifficulty);
  return cipherString(hashed, cipheredSecrets);
}

export function DecipherSecrets(hashedCharKey, cipheredSecrets) {
  try{
    const deciphered = decipherString(hashedCharKey, cipheredSecrets);
    return JSON.parse(deciphered);
  } catch (err){
    throw 'Invalid password';
  }
}

export async function DecipherSecretsQr(qrKey, cipheredSecrets) {
  try{
    const hashed = await hashString(qrKey, shortHashDifficulty);
    return decipherString(hashed, cipheredSecrets);
  } catch(err){
    throw 'Invalid qr code';
  }
}


export function ValidateQRKey(qrKey) {
  const keyBuf = Buffer.from(qrKey, encodingFormat);
  return keyBuf.length === 16;
}

async function hashString(data, difficulty) {
  const scryptSalt = 'qvaultsalthopefullyusednowhereelse';
  const scryptKeyLenBytes = 32;
  const scryptCost = Math.pow(2, difficulty);
  const scryptBlockSize = 8;
  const scryptOptions = {
    cost: scryptCost,
    blockSize: scryptBlockSize,
    maxmem: scryptCost * scryptBlockSize * 256
  };
  const hash = crypto.scryptSync(data, scryptSalt, scryptKeyLenBytes, scryptOptions);
  return await hash.toString(encodingFormat);
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
