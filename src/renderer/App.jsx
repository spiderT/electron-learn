import React, { useEffect } from 'react';
import User from './container/User';
import Chat from './container/Chat';
const { ipcRenderer, remote } = require('electron');

export default function App() {
  useEffect(() => {
    ipcRenderer.on('download-item-done', (e) => {
      console.log('下载完成✅');

      const id = remote.getGlobal('sharedObject').picWin.webContents.id;
      ipcRenderer.sendTo(id, 'download-item-done');
    });
  }, []);

  return (
    <div className="wrap">
      <User />
      <Chat />
    </div>
  );
}
