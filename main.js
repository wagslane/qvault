const { app, BrowserWindow, ipcMain, Menu, remote } = require('electron');
const windowStateKeeper = require('electron-window-state');
const path = require('path');
const { autoUpdater } = require("electron-updater");
const fs = require('fs');

autoUpdater.autoDownload = false;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// should match logic in LastUsedVaulPath.js
function setLastUsedVault(openFilePath){
  const configDir = (app || remote.app).getPath('userData');
  fs.writeFileSync(configDir + '/last_used_vault', openFilePath);
}

function createWindow() {

  // Allow users to open a qvault by clicking file on windows
  if ((process.platform == 'win32' || process.platform == 'win64') && process.argv.length >= 2) {
    const openFilePath = process.argv[1];
    setLastUsedVault(openFilePath);
  }

  // Need to wait to require screen until app is ready
  const { screen } = require('electron');
  
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  let mainWindowState = windowStateKeeper({
    defaultWidth:  Math.round(width * .7),
    defaultHeight: Math.round(height * .8)
  });

  // Create the browser window.
  mainWindow = new BrowserWindow({
    webPreferences:{
      nodeIntegration: false,
      contextIsolation: false, // We need to figure out how to enable this
      preload: path.join(__dirname, 'scripts', 'preload.js')
    },
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#131617', // @black-dark
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    icon: 'src/img/qvault-icon.png', 
    show: false 
  });
  mainWindowState.manage(mainWindow);

  mainWindow.loadFile('index.html');
  mainWindow.setMenu(null);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function () {
    // Dereference the window object
    mainWindow = null;
  });

  Menu.setApplicationMenu(Menu.buildFromTemplate([ {
    label: "Qvault",
    submenu: [
      { label: "Quit", accelerator: "CmdOrCtrl+Q", click: function () { app.quit(); } }
    ]
  }, {
    label: "Edit",
    submenu: [
      { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
      { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
      { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
      { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
      { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
      { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
    ]
  } ]));

  return mainWindow;
}

// Allow users to open a qvault by clicking file on mac
// https://github.com/electron/electron/blob/master/docs/api/app.md#event-open-file-macos
app.on('will-finish-launching', () => {
  app.on('open-file', (event, path) => {
    event.preventDefault();
    setLastUsedVault(path);
  });
});

app.on('ready', function () {
  createWindow();
  let devMode = process.defaultApp;
  if (!devMode){
    autoUpdater.checkForUpdates();
  }

  // emit systemIdle events
  const { powerMonitor } = require('electron');
  setInterval(function(){
    let idleSeconds = powerMonitor.getSystemIdleTime();
    const fiveMinutesInSeconds = 300;
    if (idleSeconds > fiveMinutesInSeconds){
      mainWindow.webContents.send('systemIdle');
    }
  }, 5000);
  powerMonitor.on('lock-screen', () => {
    mainWindow.webContents.send('systemIdle');
  });
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

app.on('window-all-closed', function () {
  app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
