const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const mainWindow = new BrowserWindow({
    // width,
    // height,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

function createFrameless(options) {
  const win = new BrowserWindow({
    ...{
      width: 300,
      height: 300,
    },
    ...options,
  });
  win.loadURL(path.join('file:', __dirname, './child.html'));
}

ipcMain.on('create-win-1', () => createFrameless({ frame: false }));

ipcMain.on('create-win-2', () => createFrameless({ titleBarStyle: 'hidden' }));

ipcMain.on('create-win-3', () => createFrameless({ titleBarStyle: 'hiddenInset' }));

ipcMain.on('create-win-4', () => createFrameless({ titleBarStyle: 'customButtonsOnHover', frame: false }));

ipcMain.on('create-win-5', () => createFrameless({ transparent: true, frame: false }));
