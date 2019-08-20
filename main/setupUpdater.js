const { app, ipcMain } = require('electron');
const { autoUpdater } = require("electron-updater");

function setupUpdater(mainWindow){
  autoUpdater.autoDownload = false;

  app.on('ready', function () {
    const devMode = process.defaultApp;
    if (!devMode) {
      autoUpdater.checkForUpdates();
    }
  });

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

module.exports = setupUpdater;
