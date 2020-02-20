const {
  app
} = require('electron');
const setAppMenu = require('./desktop/menus');
const setTray = require('./desktop/tray');
const {
  createWindow,
  show,
  close
} = require('./desktop/windows');
const path = require('path');

app.whenReady().then(() => {
  setTray()
  setAppMenu()
  app.dock.setIcon(path.join(__dirname, './resources/images/zhizhuxia_2_big.png'));
})

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', show)
  app.on('ready', createWindow)
  app.on('before-quit', close)
  app.on('activate', show)
}