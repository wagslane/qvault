const { dialog } = require('electron').remote;
var fs = require('fs');
const uuidv4 = require('uuid/v4');

var VAULT_DATA = {};
var LOCAL_VAULT_PATH = '';

const qvaultFileExtension = 'qvault';

// () => Promise(filename, err), check if err is defined
// The file data is saved in-memory globally in this module
// use getters to access it
export async function LoadLocalVault() {
  let filenames = dialog.showOpenDialog({
    filters: [{ name: 'Vaults', extensions: [qvaultFileExtension] }]
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

// () => error
// on success error == ''
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

// (string, string) => error
// on success error == ''
// A new secert is saved to in-memory vault
export function NewSecret(type, secret) {
  switch (type) {
    case 'cryptocurrency':
      VAULT_DATA.secrets.cryptocurrency[uuidv4()] = secret;
      return '';
  }
  return 'Invalid type';
}
