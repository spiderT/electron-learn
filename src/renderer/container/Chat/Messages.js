import React, {useState} from 'react';
import './index.scss';
import MsgRender from '../../components/Message';
import EmojiPackage from '../../components/EmojiPackage';
import ContentEditable from 'react-contenteditable';
import {msgBody} from '../../utils';

const { ipcRenderer, clipboard }= require('electron');
const path = require('path');

// fix warning: possible EventEmitter memory leak detected. 11 request listeners added. Use emitter.setMaxListeners() to increase limit.
ipcRenderer.setMaxListeners(100);

function render(msgData) {
    const container = [];
    if(msgData && msgData.length){
        msgData.map(item=>{
            container.push(MsgRender(item))
        })
    }
    return container
}

const originData = [
    msgBody(2, '10:29', 'zhizhuxia', 'me'), 
    msgBody(1, '你好，我是蜘蛛侠，很高兴认识你。命运无可掌控，充满了无奈、未知，然而，我依然要走下去。', 'zhizhuxia', 'me'),
    msgBody(1, '我也很高兴认识你。', 'me', 'zhizhuxia'),
];

const socket = new WebSocket("ws://localhost:8080/ws");
socket.onopen = function (event) {
    console.log('onopen')
};
socket.onclose = function (event) {
    console.log('onclose')
};

export default function Messages() {
    const [msgData, setMsgData] = useState(originData);
    const [isShowEmoji, toggleShowEmoji] = useState(false);
    const msgBox = React.createRef();
    const contentEditable = React.createRef();
    const [html, setHtml] = useState('hello');

    socket.onmessage = function (event) {
        const data = event.data;
        console.log('onmessage', data);
        if(!data || !data.startsWith('spider->')){
            return;
        }
        
        const value = data.split('->')[1];
        if(!value){
            return;
        }

        const option = {
            title: "spider",
            body: value,
            icon: path.resolve(__dirname,"../../../resources/images/zhizhuxia.png"),
        };

        const chatNotication = new Notification(option.title, option);

        chatNotication.onClick = function () {
            console.log('chatNotication.onClick');
        }

        msgData.push(msgBody(1, value, 'zhizhuxia', 'me'))
        setMsgData(msgData);
    };
    
    function captureScreen(){
        ipcRenderer.send('capture-screen')
    }

    function getSrcFromImg(str){
        let imgReg = /<img.*?(?:>|\/>)/gi //匹配图片中的img标签
        let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i // 匹配图片中的src
        let arr = str.match(imgReg)  //筛选出所有的img
        let src = arr[0].match(srcReg)
        console.log('src[1]',src[1])
        return src[1];
    }

    function handleKeyDown(e) {
        if (e.keyCode === 13 || e.which === 13) {            
            e.preventDefault(); 
            console.log('html', html);
            if (!html || !window.WebSocket) {
                return;
            }
            if (socket.readyState === WebSocket.OPEN) {
                if(html.includes('<img src')){
                    let imgSrc = getSrcFromImg(html);
                    msgData.push(msgBody(3, imgSrc, 'me', 'zhizhuxia'))
                }else{
                    msgData.push(msgBody(1, html, 'me', 'zhizhuxia'))
                }
                socket.send(html);
                
                setMsgData(msgData);
                // 发送结束后清空输入框
                setHtml('');
                if(msgBox && msgBox.current){
                    const ele = msgBox.current;
                    const scrollHeight = ele.scrollHeight;
                    // todo ?? 未生效
                    ele.scrollTo(scrollHeight, scrollHeight);
                    console.log('scrollHeight',scrollHeight)
                }
            } else {
                console.log("连接没有开启.");
            }
        }
    }

    // 上传文件
    function uploadFile(){
        ipcRenderer.send('open-directory-dialog', 'openDirectory');
    }

    // 获取选中的文件
    ipcRenderer.on('read-file',(e, {data})=>{
        console.log('read-filedata', data);
        // todo 发送出去
        socket.send(data);
        msgData.push(msgBody(3, data, 'me', 'zhizhuxia'))
        setMsgData(msgData);
    })
        

    function showEmoji(){
        toggleShowEmoji(!isShowEmoji)
    }

    function sendEmoji(item){
        console.log('item', item);
        socket.send(item);
        // todo msgData增加, 不用在 发送的时候增加，应该在socket里监听增加 filter fromid 和 toid
        msgData.push(msgBody(1, item, 'me', 'zhizhuxia'))
        setMsgData(msgData);
        showEmoji();
    }

    function handleChange(e){
        setHtml(e.target.value);
    }

    function handlePaste(e){
        const cbd = e.clipboardData;
        if (!(e.clipboardData && e.clipboardData.items)) {
	        return ;
        }
        for(let i = 0; i < cbd.items.length; i++) {
	        const item = cbd.items[i];
	        if(item.kind == "file"){
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
                    setHtml(eleHtml)
                };
                reader.readAsDataURL(blob);
	        }
	    }
    }

    ipcRenderer.on('paste-from-clipboard', (e, {data})=>{
        console.log('paste-form-clipboard', data);
    })

    return (
        <div>
            <div className="message-wrap"><div className="msg-box" ref={msgBox}>{ render(msgData)}</div></div>
            <div className="edit-wrap">
                {isShowEmoji && <EmojiPackage sendEmoji={sendEmoji}/>}
                <div className="edit-tool">
                    <span className="face" onClick={showEmoji}></span>
                    <span className="file" onClick={uploadFile}></span>
                    <span className="screenshot" onClick={captureScreen}></span>
                    {/* // 以下功能暂时不开发 */}
                    <span className="messages"></span>
                    <span className="video"></span>
                    <span className="phone"></span>
                </div>
                <ContentEditable
                    innerRef={contentEditable}
                    html={html}
                    className="edit-div"
                    disabled={false}       
                    onChange={handleChange} 
                    onKeyDown={handleKeyDown} 
                    tagName='article'
                    onPaste={handlePaste}
                />
            </div>
        </div>
    )
}