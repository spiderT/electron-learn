import React, { useEffect } from 'react';
import { ipcRenderer, remote } from 'electron';

import User from './container/User/index.jsx';
import Chat from './container/Chat/index.jsx';

export default function App() {
  useEffect(() => {
    ipcRenderer.on('download-item-done', (e) => {
      console.log('下载完成✅');

      const id = remote.getGlobal('sharedObject').picId;
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
