import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './index.scss';
import MsgRender from '../../components/Message';
import EmojiPackage from '../../components/EmojiPackage';
import ContentEditable from 'react-contenteditable';
import { msgBody } from '../../utils';
import { MyContext } from '../../context-manager';

const { ipcRenderer } = require('electron');

// fix warning: possible EventEmitter memory leak detected. 11 request listeners added. Use emitter.setMaxListeners() to increase limit.
ipcRenderer.setMaxListeners(100);

const socket = new WebSocket('ws://localhost:8080/ws');
socket.onopen = function (event) {
  console.log('onopen');
};
socket.onclose = function (event) {
  console.log('onclose');
};

export default function Messages(props) {
  console.log('props', props);
  const { setMsgData } = useContext(MyContext);
  const [isShowEmoji, toggleShowEmoji] = useState(false);
  const msgBox = React.createRef();
  const contentEditable = React.createRef();
  const [html, setHtml] = useState('');

  socket.onmessage = async (event) => {

    const data = event.data;
    if (!data || !data.startsWith('spider->')) {
      return;
    }

    const value = data.split('->')[1];
    if (!value) {
      return;
    }


    // // h5通知
    // const option = {
    //   title: 'spider',
    //   body: value,
    // };

    // // 渲染进程的Notification
    // const chatNotication = new Notification(option.title, option);

    // chatNotication.onClick = function () {
    //   console.log('chatNotication.onClick');
    // };

    handleMsg(1, value, 'receive');

    // 解决 收到消息，聊天区域没有及时渲染
    setHtml(html + ' ');

    // 发给主进程，展示Notification
    console.log('invoke msg-receive');

    const res = await ipcRenderer.invoke('msg-receive', { title: '蜘蛛侠', body: value });
    res.event === 'reply' ? onSend(res.text) : onClose();
  };

  function onClose() { }

  function onSend(html) {
    handleMsg(1, html);
  }

  function handleMsg(msgType, data, type) {
    let msg;
    if (type === 'receive') {
      msg = msgBody(msgType, data, 'zhizhuxia', 'me');
    } else {
      msg = msgBody(msgType, data, 'me', 'zhizhuxia');
      socket.send(data);
    }
    console.log('msg', msg);
    props.msgData.push(msg)
    addMsg(msg)
    setMsgData(props.msgData);
    scrollToView();
  }

  function addMsg(data) {
    console.log('addMsgdata', data);
    axios
      .post('http://127.0.0.1:1234/addmsg', {
        ...data
      })
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  }

  function captureScreen() {
    ipcRenderer.send('capture-screen');
  }

  function getSrcFromImg(str) {
    const imgReg = /<img.*?(?:>|\/>)/gi; //匹配图片中的img标签
    const srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i; // 匹配图片中的src
    const arr = str.match(imgReg); //筛选出所有的img
    const src = arr[0].match(srcReg);
    return src[1];
  }

  // 聊天内容向上滚动到可见区域
  function scrollToView() {
    const msgBoxEle = document.getElementById('msg-box');
    const msgChildNodes = msgBoxEle.childNodes;
    const len = msgChildNodes.length;
    // 因为加了一个‘’dom
    const lastChildEle = msgChildNodes[len - 2];
    setTimeout(function () {
      lastChildEle.scrollIntoView();
    }, 100);
  }

  function handleKeyDown(e) {
    if (e.keyCode === 13 || e.which === 13) {
      e.preventDefault();

      if (!html || !window.WebSocket) {
        return;
      }
      if (socket.readyState === WebSocket.OPEN) {
        // 判断发送文本，还是图片
        if (html.includes('<img src')) {
          let imgSrc = getSrcFromImg(html);
          handleMsg(3, imgSrc)
        } else {
          handleMsg(1, html)
        }
        // 发送结束后清空输入框
        setHtml(' ');
      } else {
        console.log('连接没有开启.');
      }
    }
  }

  // 上传文件
  async function uploadFile() {
    const res = await ipcRenderer.invoke('open-directory-dialog', 'openDirectory');
    console.log('res', res)
    if (res.event === 'send') {
      const data = res.data;
      handleMsg(3, data);
      // 解决 收到消息，聊天区域没有及时渲染
      setHtml(html + ' ');
    }
  }

  function showEmoji() {
    toggleShowEmoji(!isShowEmoji);
  }

  function sendEmoji(item) {
    handleMsg(1, item);
    showEmoji();
  }

  function handleChange(e) {
    setHtml(e.target.value);
  }

  function handlePasteFromIpc(arg) {
    console.log('handlePasteFromIpc');
    const eleHtml = `${html}<img src='${arg}'/>`;
    setHtml(eleHtml);
  }

  function handlePaste(e) {
    const cbd = e.clipboardData;
    if (!(e.clipboardData && e.clipboardData.items)) {
      return;
    }
    for (let i = 0; i < cbd.items.length; i++) {
      const item = cbd.items[i];
      if (item.kind == 'file') {
        const blob = item.getAsFile();
        if (blob.size === 0) {
          return;
        }
        const reader = new FileReader();
        const imgs = new Image();
        imgs.file = blob;
        reader.onload = (e) => {
          const imgPath = e.target.result;
          imgs.src = imgPath;
          const eleHtml = `${html}<img src='${imgPath}'/>`;
          setHtml(eleHtml);
        };
        reader.readAsDataURL(blob);
      }
    }
  }

  // 进程间转发
  // ipcRenderer.on('paste-from-clipboard-mainwin', (e, arg) => {
  //   console.log('paste-from-clipboard-mainwin');
  //   handlePasteFromIpc(arg);
  // });

  // 'paste-pic-from-clipboard'
  ipcRenderer.on('paste-pic-from-clipboard', (e, arg) => {
    console.log('paste-pic-from-clipboard');
    handlePasteFromIpc(arg);
  });

  return (
    <div className="chat-container">
      <div className="head">蜘蛛侠</div>
      <div className="message-wrap">
        <div id="msg-box" className="msg-box" ref={msgBox}>
          {props.msgData && props.msgData.length ? props.msgData.map((item) => MsgRender(item)) : null}
        </div>
      </div>
      <div className="edit-wrap">
        {isShowEmoji && <EmojiPackage sendEmoji={sendEmoji} />}
        <div className="edit-tool">
          <span className="face" onClick={showEmoji}>

          </span>
          <span className="file" onClick={uploadFile}>

          </span>
          <span className="screenshot" onClick={captureScreen}>

          </span>
          {/* // 以下功能暂时未开发 */}
          {/* <span className="messages disabled"></span>
                <span className="video disabled"></span>
                <span className="phone disabled"></span> */}
        </div>
        <ContentEditable
          innerRef={contentEditable}
          html={html}
          className="edit-div"
          disabled={false}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          tagName="article"
          onPaste={handlePaste}
        />
      </div>
    </div>
  );
}
