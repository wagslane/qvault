export function ClearLastUsedVault(){
  let filepath = GetLastUsedVaultPath();
  if (window.nodeAPI.fs.existsSync(filepath)) {
    window.nodeAPI.fs.unlinkSync(filepath);
  }
}

export function SetLastUsedVault(path) {
  window.nodeAPI.fs.writeFileSync(GetLastUsedVaultPath(), path);
}

export function GetLastUsedVault(){
  return window.nodeAPI.fs.readFileSync(GetLastUsedVaultPath(), 'utf-8');
}

function GetLastUsedVaultPath() {
  const configDir = (window.nodeAPI.electron.app || window.nodeAPI.electron.remote.app).getPath('userData');
  return `${configDir}/last_used_vault`;
}
