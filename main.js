const { app, BrowserWindow } = require('electron');
const electron = require('electron');
const windowStateKeeper = require('electron-window-state');
const path = require('path');
const { autoUpdater } = require("electron-updater");
const log = require('electron-log');

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');


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
  return mainWindow;
}

autoUpdater.on('checking-for-update', () => {
  log.info('Checking for update...');
  sendStatusToWindow('Checking for update...');
});
autoUpdater.on('update-available', (info) => {
  log.info('Update available.' + info);
  sendStatusToWindow('Update available.' + info);
});
autoUpdater.on('update-not-available', (info) => {
  log.info('Update not available.'+info);
  sendStatusToWindow('Update not available.' + info);
});
autoUpdater.on('error', (err) => {
  log.info('Error in auto-updater. ' + err);
  sendStatusToWindow('Error in auto-updater. ' + err);
});

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  log.info(log_message);
  sendStatusToWindow(log_message);
});

autoUpdater.on('update-downloaded', (info) => {
  log.info('Update downloaded. ' + info);
  sendStatusToWindow('Update downloaded. ' + info);
});

app.on('ready', function () {
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();
});

app.on('window-all-closed', function () {
  app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
