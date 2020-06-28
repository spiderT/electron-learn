const { ipcMain, dialog, BrowserWindow, app, Notification } = require('electron');
const fs = require('fs');
const path = require('path');
const mineType = require('mime-types');
let unread = 0;

const { createLoginWindow, close, send } = require('./windows');
let picWin, settingWin;

module.exports = function () {
  // 打开对话框事件dialog
  ipcMain.handle('open-directory-dialog', async (event) => {
    const res = new Promise((resolve, reject) =>
      resolve(
        dialog
          .showOpenDialog({
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
              {
                name: 'Images',
                extensions: ['jpg', 'jpeg', 'png', 'gif'],
              },
              // { name: 'Movies', extensions: ['mkv', 'avi', 'mp4'] },
              // { name: 'Custom File Type', extensions: ['as'] },
              // { name: 'All Files', extensions: ['*'] }
            ],
          })
          .then((result) => {
            // console.log('result', result)
            // result { canceled: false, filePaths: [ '/Users/Desktop/11.jpg' ] }
            const { canceled, filePaths } = result;
            if (canceled) {
              return { event: 'canceled' };
            }
            const filePath = filePaths[0];
            let data = fs.readFileSync(filePath);
            data = new Buffer.from(data).toString('base64');
            const base64 = 'data:' + mineType.lookup(filePath) + ';base64,' + data;
            return { event: 'send', data: base64 };
          })
          .catch((err) => console.log(err))
      )
    );
    return res;
  });

  // 图片预览
  ipcMain.on('create-pic-window', (event, arg) => {
    picWin = new BrowserWindow({
      width: 800,
      height: 600,
      resizable: false,
      webPreferences: {
        nodeIntegration: true,
      },
    });
    global.sharedObject.picId = picWin.webContents.id;

    picWin.loadURL(path.join('file:', __dirname, '../pic.html'));

    picWin.webContents.on('did-finish-load', function () {
      picWin.webContents.send('pic-url', arg);
    });

    picWin.show();

    // picWin.webContents.openDevTools();

    picWin.on('closed', () => {
      picWin.destroy();
    });
  });

  // 收到消息 msg-receive
  ipcMain.handle('msg-receive', async (event, arg) => {
    console.log('handle msg-receive');
    unread += 1;
    app.setBadgeCount(unread);
    const res = new Promise((resolve, reject) => {
      const notification = new Notification({
        title: arg.title,
        body: arg.body,
        hasReply: true,
      });
      notification.show();
      notification.on('reply', (e, reply) => {
        resolve({ event: 'reply', text: reply });
      });
      notification.on('close', (e) => {
        resolve({ event: 'close' });
      });
    });
    return res;
  });

  // 打开设置页
  ipcMain.on('open-settings', () => {
    settingWin = new BrowserWindow({
      width: 400,
      height: 300,
      resizable: false,
      titleBarStyle: 'hiddenInset',
      webPreferences: {
        nodeIntegration: true,
      },
    });

    settingWin.loadURL(path.join('file:', __dirname, '../setting.html'));

    settingWin.show();

    settingWin.on('closed', () => {
      settingWin.destroy();
    });
  });

  // 退出登录
  ipcMain.on('login-out', () => {
    close();
    settingWin.destroy();
    createLoginWindow();
  });

  // 清除未读数
  app.on('browser-window-focus', () => {
    app.setBadgeCount(0);
    unread = 0;
    send('browser-window-focus');
  });
};
