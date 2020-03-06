const { app } = require('electron');
const aboutWindow = require('./about');

const name = app.getName();
const macAppMenu = {
  label: name,
  submenu: [
    {
      label: '关于' + name,
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