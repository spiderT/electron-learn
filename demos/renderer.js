const { ipcRenderer } = require('electron');
const btn_1 = document.getElementById('btn_1');
const btn_2 = document.getElementById('btn_2');
const btn_3 = document.getElementById('btn_3');
const btn_4 = document.getElementById('btn_4');
const btn_5 = document.getElementById('btn_5');

btn_1.addEventListener('click', () => ipcRenderer.send('create-win-1'));
btn_2.addEventListener('click', () => ipcRenderer.send('create-win-2'));
btn_3.addEventListener('click', () => ipcRenderer.send('create-win-3'));
btn_4.addEventListener('click', () => ipcRenderer.send('create-win-4'));
btn_5.addEventListener('click', () => ipcRenderer.send('create-win-5'));
