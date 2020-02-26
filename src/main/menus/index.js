const { Menu, app } = require('electron');
const fileMenu = require('./file-menu');
const macAppMenu = require('./mac-app-menu');
const isMac = process.platform === 'darwin';
function createMenuTemplate() {
  const windowMenu = {
    label: '窗口',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      { type: 'separator' },
      { role: 'front' },
      { type: 'separator' },
      { role: 'window' }
    ]
  };

  const editMenu = {
    label: '编辑',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      ...(isMac ? [
        { role: 'pasteAndMatchStyle' },
        { role: 'delete' },
        { role: 'selectAll' },
        { type: 'separator' },
        {
          label: 'Speech',
          submenu: [
            { role: 'startspeaking' },
            { role: 'stopspeaking' }
          ]
        }
      ] : [
          { role: 'delete' },
          { type: 'separator' },
          { role: 'selectAll' }
        ])
    ]
  };

  const viewMenu = {
    label: '显示',
    submenu: [
      { role: 'resetzoom' },
      { role: 'zoomin' },
      { role: 'zoomout' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  }

  const helpMenu = {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://electronjs.org')
        }
      },
      {
        role: 'toggledevtools'
      }
    ]
  }

  return [
    macAppMenu,
    fileMenu,
    editMenu,
    viewMenu,
    windowMenu,
    helpMenu
  ].filter(menu => menu !== null)

}

function setAppMenu() {
  const menuTemplate = createMenuTemplate();
  const appMenu = Menu.buildFromTemplate(menuTemplate);
  app.applicationMenu = appMenu;
}

module.exports = setAppMenu;