const {
  BrowserWindow
} = require('electron');
const isDev = require('electron-is-dev');
let ipcMain = require('electron').ipcMain;

let win;
let willQuiteApp = false;
const { useCapture } = require('../../lib/capture/capture-main');

function createWindow() {
  // 初始化截图
  useCapture()

  // 创建浏览器窗口
  win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      nodeIntegration: true
    },
    minWidth: 800,
    minHeight: 600,
    frame: false,
    show: false // 先隐藏
  })

  win.on('ready-to-show', () => win.show()) // 初始化后显示

  win.on('close', e => {
    if (willQuiteApp) {
      win = null
    } else {
      e.preventDefault();
      win.hide();
    }
  })

  if (isDev) {
    win.loadURL('http://localhost:9200')
  } else {
    win.loadFile(path.resolve('./dist/index.html'))
  }
  //接收最小化命令
  ipcMain.on('window-min', () => win.minimize())
  //接收最大化命令
  ipcMain.on('window-max',  () => {
    if (win.isMaximized()) {
      win.restore();
    } else {
      win.maximize();
    }
  })
  //接收关闭命令
  ipcMain.on('window-close', () => win.close())

  // 最大化和取消最大化时，修改图标。在主进程中监听窗口的最大化操作，然后发送命令给渲染进程
  win.on('maximize', () => win.webContents.send('main-window-max'))
  win.on('unmaximize', () => win.webContents.send('main-window-unmax'))
}

function show() {
  win.show()
}

function close() {
  willQuitApp = true
  win.close()
}

function send(channel, ...args) {
  // win.webContents.senÇd('ping', 'whoooooooh!')
}



module.exports = {
  createWindow,
  show,
  close,
  send
}