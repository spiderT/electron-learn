// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, screen} = require('electron');
const path = require('path');

function createWindow() {
const { width, height } = screen.getPrimaryDisplay().workAreaSize

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    // width,
    // height,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
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
