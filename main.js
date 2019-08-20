const { app } = require('electron');
const setupUpdater = require('./main/setupUpdater');
const { openSelectedVaultWin, openSelectedVaultMac } = require('./main/openSelectedVault');
const configureWindowDisplay = require('./main/configureWindowDisplay');
const handleScreenLock = require('./main/handleScreenLock');

// keep reference to mainWindow globally
let mainWindow;

function createWindow() {
  // Allow users to open a qvault by clicking file on windows
  openSelectedVaultWin();

  // Display the main window once ready
  mainWindow = configureWindowDisplay(mainWindow);
  mainWindow.loadFile('index.html');

  // Configure hooks for autoUpdate triggers
  mainWindow = setupUpdater(mainWindow);

  // emit systemIdle events
  mainWindow = handleScreenLock(mainWindow);

  // Dereference the window object when the app closes
  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  return mainWindow;
}

// Allow users to open a qvault by clicking file on mac
openSelectedVaultMac();

app.on('ready', function () {
  createWindow();
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('window-all-closed', function () {
  app.quit();
});
