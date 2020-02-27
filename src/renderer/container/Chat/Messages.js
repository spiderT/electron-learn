import React, {useState} from 'react';
import './index.scss';
import MsgRender from '../../components/Message';
const ipcRenderer = require('electron').ipcRenderer;

function render(msgData) {
    const container = [];
    if(msgData && msgData.length){
        msgData.map(item=>{
            container.push(MsgRender(item))
        })
    }
    return container
}

const originData = [{
    type: 'tip',
    subType: 2,
    content: '10:29',
    fromId: 'zhizhuxia',
    toId: 'me',
    id: 1,
}, {
    type: 'text',
    subType: 1,
    content: '你好，我是蜘蛛侠，很高兴认识你。你好，我是蜘蛛侠，很高兴认识你。你好，我是蜘蛛侠，很高兴认识你。',
    fromId: 'zhizhuxia',
    toId: 'me',
    id: 2,
}, {
    type: 'text',
    subType: 1,
    content: '我也很高兴认识你',
    fromId: 'me',
    toId: 'zhizhuxia',
    id: 3,
}, {
    type: 'text',
    subType: 1,
    content: '嘿嘿😁',
    fromId: 'me',
    toId: 'zhizhuxia',
    id: 4,
}
];

export default function Messages() {
    const [inputValue, setValue] = useState('');
    const [msgData, setMsgData] = useState(originData);
    const msgBox = React.createRef();

    let socket;
    if (!window.WebSocket) {
        window.WebSocket = window.MozWebSocket;
    }
    if (window.WebSocket) {
        socket = new WebSocket("ws://localhost:8080/ws");
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

            msgData.push({
                type: 'text',
                subType: 1,
                content: value,
                fromId: 'zhizhuxia',
                toId: 'me',
                id: new Date().getTime(),
            })
            setMsgData(msgData);
        };
        socket.onopen = function (event) {
            console.log('onopen')
        };
        socket.onclose = function (event) {
            console.log('onclose')
        };
    } else {
        console.log("你的浏览器不支持 WebSocket！");
    }

    function captureScreen(){
        ipcRenderer.send('capture-screen')
    }

    function handleEdit(e){
        setValue(e.target.value);
    }

    function handleKeyDown(e) {
        if (e.keyCode === 13 || e.which === 13) {            
            e.preventDefault(); 
            console.log('inputValue', inputValue);
            if (!inputValue || !window.WebSocket) {
                return;
            }
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(inputValue);
                msgData.push({
                    type: 'text',
                    subType: 1,
                    content: inputValue,
                    fromId: 'me',
                    toId: 'zhizhuxia',
                    id: new Date().getTime(),
                })
                setMsgData(msgData);
                // 发送结束后清空输入框
                setValue('');
                if(msgBox && msgBox.current){
                    const ele = msgBox.current;
                    const scrollHeight = ele.scrollHeight;
                    console.log('ele', ele);
                    console.log('scrollHeight', scrollHeight);
                    ele.scrollTo(0, scrollHeight);  
                }
            } else {
                console.log("连接没有开启.");
            }
        }
    }

    return (
        <div>
            <div className="message-wrap"><div className="msg-box" ref={msgBox}>{ render(msgData)}</div></div>
            <div className="edit-wrap">
                <div className="edit-tool">
                    <span className="face"></span>
                    <span className="file"></span>
                    <span className="screenshot" onClick={captureScreen}></span>
                    <span className="messages"></span>
                    <span className="video"></span>
                    <span className="phone"></span>
                </div>
                <textarea className="edit-box" onChange={handleEdit} onKeyDown={handleKeyDown} value={inputValue} />
            </div>
        </div>
    )
}