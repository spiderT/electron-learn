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
  tray = new Tray(path.resolve(__dirname, '../../resources/images/zhizhuxia_2.png'));
  tray.on('click', console.log('click'));
  tray.on('right-click', () => {
    const contextMenu = Menu.buildFromTemplate([{
        label: '显示',
        click: show
      },
      {
        label: '退出',
        click: app.quit
      }
    ])
    tray.popUpContextMenu(contextMenu)
  })
}

module.exports = setTray;