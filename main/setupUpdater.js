const { ipcMain } = require('electron');
const { autoUpdater } = require("electron-updater");

// call after app is 'ready', setupUpdater has been called,
// and mainWindow has been created
function checkForUpdates(){
  const devMode = process.defaultApp;
  if (!devMode) {
    autoUpdater.checkForUpdates();
  }
}

function setupUpdater(mainWindow){
  autoUpdater.autoDownload = false;

  autoUpdater.on("update-available", () => {
    mainWindow.webContents.send('updateReady');
  });

  ipcMain.on("downloadUpdate", () => {
    autoUpdater.downloadUpdate();
  });

  autoUpdater.on('update-downloaded', () => {
    autoUpdater.quitAndInstall();
  });

  return mainWindow;
}

module.exports = {
  setupUpdater,
  checkForUpdates
};
