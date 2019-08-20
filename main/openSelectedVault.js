const { app, remote } = require('electron');
const fs = require('fs');

// should match logic in LastUsedVaulPath.js
function setLastUsedVault(openFilePath) {
  const configDir = (app || remote.app).getPath('userData');
  fs.writeFileSync(configDir + '/last_used_vault', openFilePath);
}

// must run before window is opened but after activate hook
function openSelectedVaultWin(){
  // Allow users to open a qvault by clicking file on windows
  if ((process.platform == 'win32' || process.platform == 'win64') && process.argv.length >= 2) {
    const openFilePath = process.argv[1];
    setLastUsedVault(openFilePath);
  }
}

// https://github.com/electron/electron/blob/master/docs/api/app.md#event-open-file-macos
function openSelectedVaultMac(){
  app.on('will-finish-launching', () => {
    app.on('open-file', (event, path) => {
      event.preventDefault();
      setLastUsedVault(path);
    });
  });
}

module.exports = {
  openSelectedVaultWin,
  openSelectedVaultMac
};
