const {
  BrowserWindow
} = require('electron');
const isDev = require('electron-is-dev');
const ipcMain = require('electron').ipcMain;
const dialog = require('electron').dialog;
const fs = require('fs');
const path = require('path');

let win;
let willQuiteApp = false;
const {
  useCapture
} = require('../../lib/capture/capture-main');

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
  ipcMain.on('window-max', () => {
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


  // 打开对话框事件dialog
  ipcMain.on('open-directory-dialog', function (event) {
    dialog.showOpenDialog({
      // properties String -包含对话框应用的功能。支持以下值:
      // openFile - 允许选择文件
      // openDirectory - 允许选择文件夹
      // multiSelections-允许多选。
      // showHiddenFiles-显示对话框中的隐藏文件。
      // createDirectory macOS -允许你通过对话框的形式创建新的目录。
      // noResolveAliases macOS -禁用自动别名 (symlink) 路径解析。 选定的别名现在将返回别名路径而不是其目标路径。
      // treatPackageAsDirectory macOS -将包 (如 .app  文件夹) 视为目录而不是文件。
      properties: ['openFile', 'openDirectory'],
      filters: [
        { name: 'Images', extensions: ['jpg', 'png', 'gif'] },
        // { name: 'Movies', extensions: ['mkv', 'avi', 'mp4'] },
        // { name: 'Custom File Type', extensions: ['as'] },
        // { name: 'All Files', extensions: ['*'] }
      ]
    }).then(result=>{
      // console.log('result', result)
      // result { canceled: false, filePaths: [ '/Users/tangting006/Desktop/11.jpg' ] }
      const {canceled, filePaths} = result;
      if(canceled){
        return
      }
      const filePath = filePaths[0];
      console.log('filePath', filePath);
      event.sender.send('read-file', {data: filePath})
      // 原本打算把选中的图片写一遍到指定位置读入，但是会触发webpack的重新编译
      // fs.readFile(filePath,(err, data)=>{
      //   if(err) throw err;
      //   const fileName = `upload${(Math.random()*10000).toFixed(0)}.png`;
      //   const pathName = path.join('./upload', fileName);
        // fs.writeFile(pathName, data, (err) => {
        //   if (err) throw err;
        //   event.sender.send('read-file', {data: fileName})
        //   console.log('文件已被保存',pathName);
        // });
      })  
    }).catch(err => {
      console.log(err)
    })
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