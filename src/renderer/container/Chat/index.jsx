import React, { useState } from 'react';
import './index.scss';
import Chatlist from './Chatlist';
import Messages from './Messages.jsx';
import { MyContext } from '../../context-manager';

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