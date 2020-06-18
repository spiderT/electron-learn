const { app, globalShortcut } = require('electron');
const setAppMenu = require('./src/main/menus');
const setTray = require('./src/main/tray');
const { createLoginWindow, createWindow, show, close } = require('./src/main/windows');
const path = require('path');
const handleIPC = require('./src/main/ipc');
const handleDownload = require('./src/main/download');
const isDev = require('electron-is-dev');

// // 开机自启动
// const AutoLaunch = require('auto-launch');

// const minecraftAutoLauncher = new AutoLaunch({
//   name: 'spiderChat',
//   path: '/Applications/spiderchat.app',
// });

// // 加入开机启动项
// minecraftAutoLauncher.enable();

// // 移除开机启动项
// // minecraftAutoLauncher.disable();

// // 检测开机启动项状态
// minecraftAutoLauncher
//   .isEnabled()
//   .then(function (isEnabled) {
//     if (isEnabled) {
//       return;
//     }
//     minecraftAutoLauncher.enable();
//   })
//   .catch(function (err) {
//     // handle error
//   });

// 开机自启动
app.setLoginItemSettings({
  openAtLogin: true,
});

app.whenReady().then(() => {
  setAppMenu();
  if (process.platform === 'darwin') {
    app.dock.setIcon(path.join(__dirname, './src/resources/images/zhizhuxia_big.png'));
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
      require('./src/main/updater.js');
    }
    require('./src/main/crash-reporter').init();
  });

  app.on('ready', () => {
    // 模拟crash
    // process.crash();
    createLoginWindow();
    const win = createWindow();
    setTray();
    handleIPC();
    // 升级包1.0.1的功能
    handleDownload(win);
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
