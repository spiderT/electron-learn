const fileMenu = require('./file-menu');
const macAppMenu = require('./mac-app-menu');
const toolsMenu = require('./tools-menu');

function createMenuTemplate(settings) {
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
    fileMenu,
    toolsMenu
  ].filter(menu => menu !== null)

}

module.exports = createMenuTemplate;