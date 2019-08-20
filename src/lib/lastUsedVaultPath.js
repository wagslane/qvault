export function clearLastUsedVault(){
  let filepath = getLastUsedVaultPath();
  if (window.nodeAPI.fs.existsSync(filepath)) {
    window.nodeAPI.fs.unlinkSync(filepath);
  }
}

export function setLastUsedVault(path) {
  window.nodeAPI.fs.writeFileSync(getLastUsedVaultPath(), path);
}

export function getLastUsedVault(){
  return window.nodeAPI.fs.readFileSync(getLastUsedVaultPath(), 'utf-8');
}

function getLastUsedVaultPath() {
  const configDir = (window.nodeAPI.electron.app || window.nodeAPI.electron.remote.app).getPath('userData');
  return `${configDir}/last_used_vault`;
}
