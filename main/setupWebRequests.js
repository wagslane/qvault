const { ipcMain } = require('electron');

function setupWebRequests(mainWindow) {
  let onlineMode = true;

  mainWindow.webContents.session.webRequest.onBeforeRequest({
    urls: [ '<all_urls>' ]
  }, (details, callback) => {
    // allow all filesystem calls
    if (details.url.substring(0, details.url.indexOf(':')) == 'file'){
      callback({cancel: false});
      return;
    }
    // don't allow web calls if offline
    if (!onlineMode){
      callback({cancel: true});
      return;
    }
    callback({cancel: false});
  });

  ipcMain.on("setOnline", () => {
    onlineMode = true;
  });

  ipcMain.on("setOffline", () => {
    onlineMode = false;
  });

  return mainWindow;
}

module.exports = setupWebRequests;
