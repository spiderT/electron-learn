import React, { useState, useEffect } from 'react';
import './index.scss';
import MsgRender from '../../components/Message';
import EmojiPackage from '../../components/EmojiPackage';
import ContentEditable from 'react-contenteditable';
import { msgBody } from '../../utils';

const { ipcRenderer } = require('electron');

// fix warning: possible EventEmitter memory leak detected. 11 request listeners added. Use emitter.setMaxListeners() to increase limit.
ipcRenderer.setMaxListeners(100);

function render(msgData) {
  const container = [];
  if (msgData && msgData.length) {
    msgData.map((item) => {
      container.push(MsgRender(item));
    });
  }
  return container;
}

const originData = [
  msgBody(2, '10:29', 'zhizhuxia', 'me', 11),
  msgBody(
    1,
    '你好，我是蜘蛛侠，很高兴认识你。命运无可掌控，充满了无奈、未知，然而，我依然要走下去。',
    'zhizhuxia',
    'me',
    12
  ),
  msgBody(1, '我也很高兴认识你。', 'me', 'zhizhuxia', 13),
];

const socket = new WebSocket('ws://localhost:8080/ws');
socket.onopen = function (event) {
  console.log('onopen');
};
socket.onclose = function (event) {
  console.log('onclose');
};

export default function Messages() {
  const [msgData, setMsgData] = useState(originData);
  const [isShowEmoji, toggleShowEmoji] = useState(false);
  const msgBox = React.createRef();
  const contentEditable = React.createRef();
  const [html, setHtml] = useState('');

  useEffect(() => {
    // 获取选中的文件
    ipcRenderer.on('read-file', (e, { data }) => {
      // 发送出去
      socket.send(data);
      msgData.push(msgBody(3, data, 'me', 'zhizhuxia'));
      setMsgData(msgData);
      // 解决 收到消息，聊天区域没有及时渲染
      setHtml(html + '   ');
    });
  }, [msgData]);

  socket.onmessage = async (event) => {
    const data = event.data;
    // console.log('onmessage', data);
    if (!data || !data.startsWith('spider->')) {
      return;
    }

    const value = data.split('->')[1];
    if (!value) {
      return;
    }

    // // 通知
    // const option = {
    //   title: 'spider',
    //   body: value,
    // };

    // // 渲染进程的Notification
    // const chatNotication = new Notification(option.title, option);

    // chatNotication.onClick = function () {
    //   console.log('chatNotication.onClick');
    // };

    msgData.push(msgBody(1, value, 'zhizhuxia', 'me'));
    setMsgData(msgData);

    // 解决 收到消息，聊天区域没有及时渲染
    setHtml(html + '   ');

    scrollToView();

    // 发给主进程，展示Notification
    const res = await ipcRenderer.invoke('msg-receive', { title: '蜘蛛侠', body: value });
    res.event === 'action' ? onsend(res.text) : onclose()
  };

  function onclose() { }

  function onsend(html) {
    msgData.push(msgBody(1, html, 'me', 'zhizhuxia'));
    socket.send(html);
    setMsgData(msgData);
    // 发送结束后清空输入框
    setHtml('');
    scrollToView();
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
          msgData.push(msgBody(3, imgSrc, 'me', 'zhizhuxia'));
        } else {
          msgData.push(msgBody(1, html, 'me', 'zhizhuxia'));
        }
        socket.send(html);

        setMsgData(msgData);
        // 发送结束后清空输入框
        setHtml('');

        scrollToView();
      } else {
        console.log('连接没有开启.');
      }
    }
  }

  // 上传文件
  function uploadFile() {
    ipcRenderer.send('open-directory-dialog', 'openDirectory');
  }

  function showEmoji() {
    toggleShowEmoji(!isShowEmoji);
  }

  function sendEmoji(item) {
    console.log('item', item);
    socket.send(item);
    // todo msgData增加, 不用在 发送的时候增加，应该在socket里监听增加 filter fromid 和 toid
    msgData.push(msgBody(1, item, 'me', 'zhizhuxia'));
    setMsgData(msgData);
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
    <div>
      <div className="message-wrap">
        <div id="msg-box" className="msg-box" ref={msgBox}>
          {' '}
          {render(msgData)}{' '}
        </div>{' '}
      </div>{' '}
      <div className="edit-wrap">
        {' '}
        {isShowEmoji && <EmojiPackage sendEmoji={sendEmoji} />}{' '}
        <div className="edit-tool">
          <span className="face" onClick={showEmoji}>
            {' '}
          </span>{' '}
          <span className="file" onClick={uploadFile}>
            {' '}
          </span>{' '}
          <span className="screenshot" onClick={captureScreen}>
            {' '}
          </span>{' '}
          {/* // 以下功能暂时未开发 */}{' '}
          {/* <span className="messages disabled"></span>
                <span className="video disabled"></span>
                <span className="phone disabled"></span> */}{' '}
        </div>{' '}
        <ContentEditable
          innerRef={contentEditable}
          html={html}
          className="edit-div"
          disabled={false}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          tagName="article"
          onPaste={handlePaste}
        />{' '}
      </div>{' '}
    </div>
  );
}
