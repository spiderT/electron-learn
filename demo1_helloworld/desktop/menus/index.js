const fileMenu = require('./file-menu');
const macAppMenu = require('./mac-app-menu');

function createMenuTemplate(settings){
  const windowMenu = {
    role: 'window',
    submenu: [
      {role: 'minimize'},
      { role: 'close' },
      { type: 'separator' },
      { role: 'front' },
    ]
  };

  return [
      macAppMenu,
      windowMenu,
      fileMenu
  ].filter(menu => menu !== null)

}

module.exports = createMenuTemplate;