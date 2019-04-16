const { app, BrowserWindow } = require('electron');
const electron = require('electron');
const windowStateKeeper = require('electron-window-state');
const path = require('path');
const { autoUpdater } = require("electron-updater");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function sendStatusToWindow(text) {
  mainWindow.webContents.send('message', text);
}

function createWindow() {
  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
  let mainWindowState = windowStateKeeper({
    defaultWidth:  Math.round(width * .7),
    defaultHeight: Math.round(height * .8)
  });

  // Create the browser window.
  mainWindow = new BrowserWindow({
    webPreferences:{
      nodeIntegration: false,
      contextIsolation: false, // We need to figure out how to enable this
      preload: path.join(__dirname, 'preload.js')
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
}

autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available. ' + info);
});

autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err);
});

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
});

autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded. ' + info);
});

app.on('ready', createWindow);

app.on('ready', function () {
  autoUpdater.checkForUpdatesAndNotify();
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
