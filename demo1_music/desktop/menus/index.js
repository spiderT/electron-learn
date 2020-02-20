const {Menu, app} = require('electron');
const controlMenu = require('./control-menu');
const macAppMenu = require('./mac-app-menu');
const toolsMenu = require('./tools-menu');

function createMenuTemplate() {
  const windowMenu = {
    role: 'window',
    submenu: [{
        role: 'minimize'
      },
      {
        role: 'close'
      },
      {
        type: 'separator'
      },
      {
        role: 'front'
      },
    ]
  };

  return [
    macAppMenu,
    windowMenu,
    controlMenu,
    toolsMenu
  ].filter(menu => menu !== null)

}

function setAppMenu(){
  const menuTemplate = createMenuTemplate();
  const appMenu = Menu.buildFromTemplate(menuTemplate);
  app.applicationMenu = appMenu;
}

module.exports = setAppMenu;