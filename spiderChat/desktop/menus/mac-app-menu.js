const {app} = require('electron');
const aboutWindow = require('./about');

const macAppMenu = {
  label: app.name,
  submenu: [
    {
      label: 'about',
      click: aboutWindow
    },
    { type: 'separator' },
    { role: 'hide' },
    { role: 'hideothers' },
    { role: 'unhide' },
    { type: 'separator' },
    { role: 'quit' },
  ]
}


module.exports = macAppMenu;