// don't call until app is 'ready' and mainWindow is created
function handleScreenLock(mainWindow) {
  const { powerMonitor } = require('electron');
  setInterval(function () {
    let idleSeconds = powerMonitor.getSystemIdleTime();
    const fiveMinutesInSeconds = 300;
    if (idleSeconds > fiveMinutesInSeconds) {
      mainWindow.webContents.send('systemIdle');
    }
  }, 5000);
  powerMonitor.on('lock-screen', () => {
    mainWindow.webContents.send('systemIdle');
  });
  return mainWindow;
}

module.exports = handleScreenLock;
