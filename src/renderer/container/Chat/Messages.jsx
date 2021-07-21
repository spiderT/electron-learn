import React, { useState, useEffect, useContext } from 'react';
import { ipcRenderer, remote } from 'electron';
import MsgRender from '../../components/Message';
import EmojiPackage from '../../components/EmojiPackage';
import ContentEditable from 'react-contenteditable';
import { msgBody } from '../../utils';
import { USER_NAME, SPIDER_MAN } from '../../constants';
import { MyContext } from '../../context-manager';
import './index.scss';

let unread = 0;
const app = remote.app;

const TO_ID = USER_NAME;
const FROM_ID = SPIDER_MAN;
ipcRenderer.setMaxListeners(100);

const socket = new WebSocket('ws://localhost:8080/ws');
socket.onopen = (event) => {
  console.log('onopen');
};
socket.onclose = (event) => {
  console.log('onclose');
};

export default function Messages(props) {
  const { msgData = [] } = props;
  const { setMsgData } = useContext(MyContext);
  const [isShowEmoji, toggleShowEmoji] = useState(false);
  const msgBox = React.createRef();
  const contentEditable = React.createRef();
  const [editHtml, setHtml] = useState('');

  useEffect(() => {
    setTimeout(() => scrollToView(), 300);
    // 'paste-pic-from-clipboard'
    ipcRenderer.on('paste-pic-from-clipboard', (e, arg) => {
      console.log('paste-pic-from-clipboard');
      handlePasteFromIpc(arg);
    });

    // 清除未读数
    ipcRenderer.on('browser-window-focus', () => {
      unread = 0;
    })
  }, [])

  socket.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.fromId !== TO_ID) {
      return
    }

    handleMsg(msg.type, msg.content, 'receive');

    if (document.hidden) {
      createNativeNotification(msg);
      // createHtmlNotification(msg) 

      unread += 1;
      app.setBadgeCount(unread);
      // handleNativeNoti(msg);
    }
  };

  function createHtmlNotification(msg) {
    // h5通知
    const option = {
      title: '蜘蛛侠',
      body: msg.content,
    };

    // 渲染进程的Notification
    const chatNotication = new Notification(option.title, option);
    chatNotication.onclick = () => {
      console.log('clickchatNotication')
    }
  }

  async function createNativeNotification(msg) {
    // 发给主进程，展示Notification
    const res = await ipcRenderer.invoke('msg-receive', { title: '蜘蛛侠', body: msg.content });
    console.log('res', res);
    res.event === 'reply' ? onSend(res.text) : onClose();
  }

  function handleNativeNoti(msg) {
    const notification = new remote.Notification({
      title: '蜘蛛侠',
      body: msg.content,
      hasReply: true,
    });
    notification.show();
    notification.on('reply', (e, reply) => {
      onSend(reply)
    });
    notification.on('close', (e) => {
      onClose()
    });
  }

  function onClose() { }

  function onSend(data) {
    handleMsg(1, data);
    // todo 解决 收到消息，聊天区域没有及时渲染
    document.getElementsByClassName('list-item')[0].click();
  }

  function handleMsg(msgType, data, type) {
    console.log('handleMsg', msgType, data, type)
    if (!data) {
      return
    }
    let msg;
    if (type === 'receive') {
      msg = msgBody(msgType, data, TO_ID, FROM_ID);
    } else {
      msg = msgBody(msgType, data, FROM_ID, TO_ID);
      socket.send(JSON.stringify(msg));
      addMsg(msg)
    }
    setMsgData(pre => [...pre, msg]);
    // todo 解决 收到消息，聊天区域没有及时渲染
    setHtml(editHtml + ' ');
    scrollToView();
  }

  function addMsg(data) {
    fetch('http://127.0.0.1:1234/addmsg', {
      body: JSON.stringify(data),
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
    })
      .then((response) => console.log(response))
      .catch((error) => console.log(error))
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
    lastChildEle && setTimeout(function () {
      lastChildEle.scrollIntoView();
    }, 100);
  }

  function handleKeyDown(e) {
    if (e.keyCode === 13 || e.which === 13) {
      e.preventDefault();

      if (!editHtml || !editHtml.trim() || !window.WebSocket) {
        return;
      }
      if (socket.readyState === WebSocket.OPEN) {
        // 判断发送文本，还是图片
        if (editHtml.includes('<img src')) {
          let imgSrc = getSrcFromImg(editHtml);
          handleMsg(3, imgSrc)
        } else {
          handleMsg(1, editHtml)
        }
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
    }
  }

  function showEmoji() {
    toggleShowEmoji(!isShowEmoji);
  }

  function handleLeaveEmoji() {
    toggleShowEmoji(false)
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
    const eleHtml = `${editHtml}<img src='${arg}'/>`;
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
          const eleHtml = `${editHtml}<img src='${imgPath}'/>`;
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



  return (
    <div className="chat-container">
      <div className="head">蜘蛛侠</div>
      <div className="message-wrap">
        <div id="msg-box" className="msg-box" ref={msgBox}>
          {msgData.length ? msgData.map((item) => MsgRender(item)) : null}
        </div>
      </div>
      <div className="edit-wrap">
        {isShowEmoji && <EmojiPackage sendEmoji={sendEmoji} handleLeave={handleLeaveEmoji} />}
        <div className="edit-tool">
          <span className="face" onClick={showEmoji} />
          <span className="file" onClick={uploadFile} />
          <span className="screenshot" onClick={captureScreen} />
          {/* // 以下功能暂时未开发 */}
          {/* <span className="messages disabled"></span>
                <span className="video disabled"></span>
                <span className="phone disabled"></span> */}
        </div>
        <ContentEditable
          innerRef={contentEditable}
          html={editHtml}
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
