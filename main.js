const {
  app
} = require('electron');
const setAppMenu = require('./src/main/menus');
const setTray = require('./src/main/tray');
const {
  createWindow,
  show,
  close
} = require('./src/main/windows');
const path = require('path');
const isDev = require('electron-is-dev');
const handleIPC = require('./src/main/ipc');



if (isDev) {
  /* eslint-disable */
  require('electron-nice-auto-reload')({
    rootPath: path.join(process.cwd()),
    rules: [{
      // relaunch the app while main process related js files
      // were changed
      action: 'app.relaunch',
      target: 'ipc.js|main.js'
    }],
    ignored: /node_modules/,
    log: true,
    devToolsReopen: true
  })
}

// 开机自启动
const AutoLaunch = require('auto-launch');

const minecraftAutoLauncher = new AutoLaunch({
  name: 'spiderChat',
  // path: '/Applications/spiderChat.app',
});

// 加入开机启动项
minecraftAutoLauncher.enable();

// 移除开机启动项
// minecraftAutoLauncher.disable();

// 检测开机启动项状态
minecraftAutoLauncher.isEnabled()
  .then(function (isEnabled) {
    if (isEnabled) {
      return;
    }
    minecraftAutoLauncher.enable();
  })
  .catch(function (err) {
    // handle error
  });


app.whenReady().then(() => {
  setAppMenu()
  app.dock.setIcon(path.join(__dirname, './src/resources/images/zhizhuxia_big.png'));
})

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', show)
  app.on('ready', () => {

    createWindow();
    setTray();
    handleIPC();
  })
  app.on('before-quit', close)
  app.on('will-finish-launching', () => {
    // 自动更新
    // if(!isDev) {
    // require('./src/main/updater.js');
    // }
    require('./src/main/crash-reporter').init();
  })
}