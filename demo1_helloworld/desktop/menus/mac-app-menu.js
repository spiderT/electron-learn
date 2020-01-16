const {app} = require('electron');


const macAppMenu = {
  label: app.name,
  submenu: [
    { type: 'separator' },
    { role: 'hide' },
    { role: 'hideothers' },
    { role: 'unhide' },
    { type: 'separator' },
    { role: 'quit' },
  ]
}


module.exports = macAppMenu;