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

app.whenReady().then(() => {
  setAppMenu()
  app.dock.setIcon(path.join(__dirname, './src/resources/images/zhizhuxia_big.png'));
})

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', show)
  app.on('ready', setTray)
  app.on('before-quit', close)
  app.on('activate', createWindow)
}