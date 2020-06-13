const { ipcRenderer } = require('electron');

const btns = [1, 2, 3, 4, 5];

btns.map((i) =>
  document.getElementById(`btn_${i}`).addEventListener('click', () => ipcRenderer.send(`create-win-${i}`))
);
