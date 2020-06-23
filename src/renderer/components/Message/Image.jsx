import React from 'react';
import './Image.scss';
// const { ipcRenderer } = require('electron');
import { ipcRenderer } from 'electron';

function handleZoom(src) {
  ipcRenderer.send('create-pic-window', src);
}

const Image = (props) => {
  const content = props.content;
  return (
    <span className="msg-text">
      <img src={content} onClick={() => handleZoom(content)} />
    </span>
  );
};

export default Image;
