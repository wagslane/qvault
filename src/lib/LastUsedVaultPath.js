// main.js uses this file so all imports should use
// require syntax
const { app, remote } = require('electron');
const fs = require('fs');

function ClearLastUsedVault(){
  let filepath = GetLastUsedVaultPath();
  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath);
  }
}

function SetLastUsedVault(path) {
  fs.writeFileSync(GetLastUsedVaultPath(), path);
}

function GetLastUsedVault(){
  return fs.readFileSync(GetLastUsedVaultPath(), 'utf-8');
}

function GetLastUsedVaultPath() {
  const configDir = (app || remote.app).getPath('userData');
  return `${configDir}/last_used_vault`;
}

module.exports = {
  ClearLastUsedVault,
  SetLastUsedVault,
  GetLastUsedVault
};

