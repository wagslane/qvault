import crypto from 'crypto';
import stringify from 'json-stable-stringify';
import WordList from './WordList';

import secureRandomNumber from '../secureRandomNumber';

const BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

const cipherAlgo = 'aes-256-gcm';
const encodingFormat = 'base64';
const textFormat = 'utf8';

const longHashDifficulty = 17;
const shortHashDifficulty = 10;

// QR Key (256 bit, base64) = Encoded in the QR Card, generated in QVault factory
// Char Key (16 chars, base58) = Back of the Qvault recovery card, generated randomly by this app
// Pass Key (256 bit, base64) = Hash(password, salt) or Hash(passphrase, salt), used to cipher the Char Key for easy access

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
  if (passphrase.length < minLength) {
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
    let index = await secureRandomNumber(0, WordList.length - 1);
    phrase.push(WordList[index]);
  }
  return phrase.join(" ");
}

export async function GeneratePassword(passwordLength) {
  let password = '';
  const lower = 'abcdefghijkmnopqrstuvwxyz';
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const chars = '@!#%[]^()-';
  const numbers = '123456789';
  const allPossible = lower + upper + chars + numbers;
  password += lower[await secureRandomNumber(0, lower.length - 1)];
  password += upper[await secureRandomNumber(0, upper.length - 1)];
  password += chars[await secureRandomNumber(0, chars.length - 1)];
  password += numbers[await secureRandomNumber(0, numbers.length - 1)];
  for (let i = password.length; i < passwordLength; i++){
    password += allPossible[await secureRandomNumber(0, allPossible.length - 1)];
  }
  return password.split('').sort(() => 1 - secureRandomNumber(0, 1)).join('');
}

// () => Promise(string)
export async function GenerateCharKey() {
  // log2(58^16) = 93.7 bits entropy
  const length = 16;

  let key = '';
  for (let i = 0; i < length; i++) {
    let index = await secureRandomNumber(0, BASE58.length - 1);
    key += BASE58.charAt(index);
  }
  return key;
}

export async function PassKeyFromPassword(password, salt) {
  return await hashString(password, longHashDifficulty, salt);
}

export async function HashCharKey(charKey, salt) {
  return await hashString(charKey, longHashDifficulty, salt);
}

export async function HashCloudVault(vault) {
  return crypto.createHash('sha256').update(stringify(vault)).digest('hex');
}

export async function DeriveOldCloudKey(password) {
  let passKey = await PassKeyFromPassword(password);
  const cloudSalt = '-cloud-salt';
  return await hashString(passKey + cloudSalt, shortHashDifficulty);
}

export async function DeriveCloudKey(password) {
  // This salt ensures we get a different password sent to our servers
  // than the one used to encrypt the vault. It's okay that it isn't random
  // because the resulting hash is salted again before being stored on our
  // servers
  const cloudSalt = '25c1be5d-a367-4033-b40d-8638b14cb7db';
  return await hashString(password, shortHashDifficulty, cloudSalt);
}

export function CipherCharKey(passKey, charKey) {
  return cipherString(passKey, charKey);
}

export function DecipherCharKey(passKey, cipheredCharKey) {
  try {
    return decipherString(passKey, cipheredCharKey);
  } catch (err) {
    throw 'Invalid password';
  }
}

export function CipherSecrets(hashedCharKey, secrets) {
  const secretsString = JSON.stringify(secrets);
  return cipherString(hashedCharKey, secretsString);
}

export async function CipherSecretsQr(qrKey, cipheredSecrets) {
  const hashed = await hashString(qrKey, shortHashDifficulty);
  return cipherString(hashed, cipheredSecrets);
}

export function DecipherSecrets(hashedCharKey, cipheredSecrets) {
  try {
    const deciphered = decipherString(hashedCharKey, cipheredSecrets);
    return JSON.parse(deciphered);
  } catch (err) {
    throw 'Invalid password';
  }
}

export async function DecipherSecretsQr(qrKey, cipheredSecrets) {
  try {
    const hashed = await hashString(qrKey, shortHashDifficulty);
    return decipherString(hashed, cipheredSecrets);
  } catch (err) {
    throw 'Invalid qr code';
  }
}


export function ValidateQRKey(qrKey) {
  const keyBuf = Buffer.from(qrKey, encodingFormat);
  // Allow 128 bit keys for legacy purposes
  return keyBuf.length === 16 || keyBuf.length === 32;
}

export function GenerateRandomSalt() {
  return crypto.randomBytes(16).toString('base64');
}

// The default salt is used in cases where rainbow tables are ineffective (keys not passwords)
const defaultSalt = 'qvaultsalthopefullyusednowhereelse';
async function hashString(data, difficulty, scryptSalt = defaultSalt) {
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
