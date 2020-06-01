import React from 'react';
import './Image.scss';
const {BrowserWindow} = require('electron').remote;
const path = require('path');

let picWin;


function handleZoom(src){
  const modalPath = path.join('file://', __dirname, './pic.html');
  // const modalPath = 'https://github.com';
  console.log('modalPath', modalPath)
  picWin = new BrowserWindow({ width: 600, height: 475 });

  picWin.on('close', () => { win = null });
  picWin.loadURL(modalPath);
  picWin.show();
}

const Image = (props) => {
  const content = props.content;
  return (
          <span className='msg-text' >
             {/* base64格式图片 */}
             <img src={content} onClick={()=>handleZoom(content)}/>
          </span>
  );
};

export default Image;