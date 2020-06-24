import React, { useState } from 'react';
import './index.scss';
import Chatlist from './Chatlist';
import Messages from './Messages.jsx';
import { MyContext } from '../../context-manager';
import { ipcRenderer } from 'electron';

function addDarkMode() {
    document.getElementsByTagName('body')[0].classList.add("dark-mode");
}

function removeDarkMode() {
    document.getElementsByTagName('body')[0].classList.remove("dark-mode");
}

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    addDarkMode();
} else {
    removeDarkMode();
}

ipcRenderer.on('change-mode', (e, arg) => {
    console.log('change-mode')
    if (arg) {
        addDarkMode();
    } else {
        removeDarkMode();
    }
})

function Chat() {

    const [msgData, setMsgData] = useState([]);

    return (
        <MyContext.Provider value={{ setMsgData }}>
            <div className="right-wrap">
                <div className="chat-wrap">
                    <div className="search">
                        <input placeholder="搜索" />
                        <span className="icon" />
                        <span className="plus">+</span>
                    </div>
                    <Chatlist msgData={msgData} />
                </div>
                <Messages msgData={msgData} />
            </div>
        </MyContext.Provider>
    );
}

export default Chat;