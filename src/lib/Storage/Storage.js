const { dialog } = require('electron').remote;
var fs = require('fs');
const uuidv4 = require('uuid/v4');

var VAULT_DATA = {};
var LOCAL_VAULT_PATH = '';

const qvaultFileExtension = 'qvault';

export const SECRET_TYPE_CRYPTOCURRENCY = 'cryptocurrency';

export async function LoadLocalVault() {
  let filenames = dialog.showOpenDialog({
    filters: [ { name: 'Vaults', extensions: [ qvaultFileExtension ] } ]
  });

  if (filenames === undefined) {
    throw new Error('No file selected');
  }

  if (filenames.length < 1 || filenames.length > 1) {
    throw new Error('Please select one file');
  }

  try {
    let data = fs.readFileSync(filenames[0], 'utf-8');
    VAULT_DATA = JSON.parse(data);
    LOCAL_VAULT_PATH = filenames[0];
  } catch (err) {
    throw new Error("Couldn't read file");
  }

  if (VAULT_DATA.version === undefined || VAULT_DATA.version == '') {
    throw new Error("Selected vault doesn't contain a version");
  }

  return filenames[0];
}

export function SaveLocalVault() {
  if (LOCAL_VAULT_PATH == '') {
    return 'No vault path is set';
  }
  try {
    fs.writeFileSync(LOCAL_VAULT_PATH, JSON.stringify(VAULT_DATA));
  } catch (err) {
    return err;
  }
}

export function NewSecretCryptocurrency(secret) {
  VAULT_DATA.secrets[SECRET_TYPE_CRYPTOCURRENCY][uuidv4()] = secret;
}

export function UpdateSecret(uuid, secret) {
  ensureSecrets();
  if (!(uuid in VAULT_DATA.secrets[SECRET_TYPE_CRYPTOCURRENCY])) {
    return "That secret doesn't exist";
  }
  VAULT_DATA.secrets[SECRET_TYPE_CRYPTOCURRENCY][uuid] = secret;
  return '';
}

export function DeleteSecret(uuid) {
  ensureSecrets();
  delete VAULT_DATA.secrets[SECRET_TYPE_CRYPTOCURRENCY][uuid];
}

export function GetSecretsCryptocurrency() {
  ensureSecrets();
  let copy = VAULT_DATA.secrets[SECRET_TYPE_CRYPTOCURRENCY];
  return copy;
}

function ensureSecrets() {
  if (!('secrets' in VAULT_DATA)) {
    VAULT_DATA.secrets = {};
  }
  if (!(SECRET_TYPE_CRYPTOCURRENCY in VAULT_DATA.secrets)) {
    VAULT_DATA.secrets[SECRET_TYPE_CRYPTOCURRENCY] = {};
  }
}
