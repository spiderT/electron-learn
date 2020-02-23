const {
  BrowserWindow
} = require('electron');
const isDev = require('electron-is-dev');

let win;
let willQuiteApp = false;

function createWindow() {
  // 创建浏览器窗口
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
    frame: false 
  })

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