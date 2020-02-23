import React from 'react';
import './index.scss';
import Chatlist from './Chatlist';
import ChatContainer from './ChatContainer';

function Chat() {


    return (
        <div className="right-wrap">
            <div className="chat-wrap">
                <div className="search">
                    <input placeholder="搜索" />
                    <span className="icon" />
                    <span className="plus">+</span>
                </div>
                <Chatlist />
            </div>
            <ChatContainer />
        </div>
    );
}

export default Chat;