const {
  app,
  Menu,
  Tray
} = require('electron');
const {
  show
} = require('../windows');
const path = require('path');

let tray;

function setTray() {
  tray = new Tray(path.resolve(__dirname, '../../resources/images/zhizhuxia_small.png'));
  const contextMenu = Menu.buildFromTemplate([{
      label: '显示',
      click: show
    },
    {
      label: '退出',
      click: app.quit
    }
  ])
  tray.setContextMenu(contextMenu)
  tray.setToolTip('spiderChat')
}

module.exports = setTray;