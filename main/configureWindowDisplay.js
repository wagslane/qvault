const { app, BrowserWindow, Menu } = require('electron');
const windowStateKeeper = require('electron-window-state');
const path = require('path');

// don't call until app is 'ready'
function configureWindowDisplay(mainWindow) {
  // Need to wait to require screen until app is ready
  const { screen } = require('electron');

  // set screen height/width based on memory
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  let mainWindowState = windowStateKeeper({
    defaultWidth: Math.round(width * .7),
    defaultHeight: Math.round(height * .8)
  });

  // Create the browser window.
  mainWindow = new BrowserWindow({
    webPreferences: {
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
    show: false
  });

  // record changes to window state for next time
  mainWindowState.manage(mainWindow);

  // no menu
  mainWindow.setMenu(null);

  // Add mac cmd capabilities
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

  // show the window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  return mainWindow;
}

module.exports = configureWindowDisplay;
