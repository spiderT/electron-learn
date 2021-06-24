const { app, globalShortcut } = require('electron');
const setAppMenu = require('./menus');
const setTray = require('./tray');
const { createLoginWindow, createWindow, show, close } = require('./windows');
const path = require('path');
const handleIPC = require('./ipc');
const handleDownload = require('./download');
const isDev = require('electron-is-dev');

// 开机自启动
app.setLoginItemSettings({
  openAtLogin: true,
});

app.whenReady().then(() => {
  setAppMenu();
  if (process.platform === 'darwin') {
    app.dock.setIcon(path.join(__dirname, '../resources/images/zhizhuxia_big.png'));
  }
});

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', show);

  app.on('will-finish-launching', () => {
    // 自动更新
    if (!isDev) {
      require('./updater.js');
    }
    require('./crash-reporter').init();
  });

  app.on('ready', () => {
    createLoginWindow();
    const win = createWindow();
    setTray();
    handleIPC();
    handleDownload(win);
    // 模拟crash
    // process.crash();
  });

  app.on('activate', show);

  app.on('before-quit', close);

  app.on('will-quit', () => {
    // Unregister all shortcuts.
    globalShortcut.unregisterAll();
  });

  app.on('open-url', (event, url) => {
    event.preventDefault();
    console.log('open-url');
  });
}
