export function getPreferenceFromFile(key){
  if (!preferenceFileExists()){
    return;
  }
  const preferences = getPreferences(getPreferenceFilePath());
  return preferences[key]; 
}

export function writeToPreferenceFile(key, value){
  const path = getPreferenceFilePath();
  const preferences = getPreferences(path);
  preferences[key] = value;
  window.nodeAPI.fs.writeFileSync(path, JSON.stringify(preferences));
}

export function preferenceFileExists() {
  return window.nodeAPI.fs.existsSync(getPreferenceFilePath());
}

export function createPreferenceFile() {
  const defaultPreferences = require('../consts/defaultPreferences.json');
  const path = getPreferenceFilePath();
  window.nodeAPI.fs.writeFileSync(path, JSON.stringify(defaultPreferences));
}

function getPreferences(path){
  const file = window.nodeAPI.fs.readFileSync(path, 'utf-8');
  return JSON.parse(file);
}

function getPreferenceFilePath(){
  const configDir = (window.nodeAPI.electron.app || window.nodeAPI.electron.remote.app).getPath('userData');
  return `${configDir}/preferences.json`;
}
