import React from 'react';
import './index.scss';
import Messages from './Messages.jsx';

export default function ChatContainer() {

    return (
        <div className="chat-container">
            <div className="head">蜘蛛侠</div>
            <Messages />
        </div>
    );
}
