const { session, app } = require('electron');
const fs = require('fs');
const path = require('path');

module.exports = (win) =>
  session.defaultSession.on('will-download', async (event, item) => {
    const fileName = item.getFilename();
    const url = item.getURL();
    const startTime = item.getStartTime();
    const initialState = item.getState();
    const downloadPath = app.getPath('downloads');

    let fileNum = 0;
    let savePath = path.join(downloadPath, fileName);

    // savePath基础信息
    const ext = path.extname(savePath);
    const name = path.basename(savePath, ext);
    const dir = path.dirname(savePath);

    // 文件名自增逻辑
    while (fs.existsSync(savePath)) {
      fileNum += 1;
      savePath = path.format({
        dir,
        ext,
        name: `${name}(${fileNum})`,
      });
    }

    // 设置下载目录，阻止系统dialog的出现
    item.setSavePath(savePath);

    // 通知渲染进程，有一个新的下载任务
    win.webContents.send('new-download-item', {
      savePath,
      url,
      startTime,
      state: initialState,
      paused: item.isPaused(),
      totalBytes: item.getTotalBytes(),
      receivedBytes: item.getReceivedBytes(),
    });

    // 下载任务更新
    item.on('updated', (e, state) => {
      win.webContents.send('download-item-updated', {
        startTime,
        state,
        totalBytes: item.getTotalBytes(),
        receivedBytes: item.getReceivedBytes(),
        paused: item.isPaused(),
      });
    });

    // 下载任务完成
    item.on('done', (e, state) => {
      win.webContents.send('download-item-done', {
        startTime,
        state,
      });
    });
  });
