const { BrowserWindow, ipcMain, app } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');

let win;
let loginWin;
let willQuitApp = false;
const { createShortcut } = require('../../lib/capture/main');

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

function createLoginWindow() {
  loginWin = new BrowserWindow({
    width: 300,
    height: 400,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
    },
    resizable: false,
  });

  loginWin.loadFile(path.join(__dirname, '../../login.html'));
}

// 登录
ipcMain.on('login-error', (event, arg) => {
  console.log('login-error');
  // todo 未生效？？?
  loginWin.flashFrame(true);
});

ipcMain.on('login-success', (event, arg) => {
  console.log('login-success');
  createWindow();
  loginWin.close();
  win.setSize(900, 700);
  win.center();
});

ipcMain.on('close-login', (event, arg) => {
  console.log('close-login');
  loginWin.close();
  close();
  loginWin = null;
  win = null;
});

function createWindow() {
  // 创建浏览器窗口
  win = new BrowserWindow({
    width: 0,
    height: 0,
    webPreferences: {
      nodeIntegration: true,
    },
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: 'hiddenInset',
    show: false, // 先隐藏
    icon: path.join(__dirname, '../../resources/images/zhizhuxia.png'),
    backgroundColor: '#f3f3f3', // 优化白屏，设置窗口底色
  });

  global.sharedObject = {
    mainId: win.webContents.id,
  };

  // 初始化截图
  createShortcut();

  win.on('ready-to-show', () => win.show()); // 初始化后显示

  win.on('close', (e) => {
    console.log('close', willQuitApp);
    if (willQuitApp) {
      win = null;
    } else {
      e.preventDefault();
      win.hide();
    }
  });

  if (isDev) {
    win.loadURL('http://localhost:9200');
  } else {
    win.loadFile(path.join(__dirname, '../../../build/index.html'));
  }

  // // 打开开发者工具
  // win.webContents.openDevTools()

  // 进程间转发
  // ipcMain.on('paste-from-clipboard-capwin', (event, arg) => {
  //   console.log('paste-from-clipboard-capwin')
  //   win.webContents.send('paste-from-clipboard-mainwin', arg)
  // })
  return win;
}

function show() {
  win.show();
}

function close() {
  willQuitApp = true;
  win.close();
}

function send(channel, ...args) {
  win.webContents.send(channel, ...args);
}

module.exports = {
  createLoginWindow,
  createWindow,
  show,
  close,
  send,
};
