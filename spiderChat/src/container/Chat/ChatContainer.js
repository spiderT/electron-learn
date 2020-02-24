import React from 'react';
import './index.scss';
import Messages from './Messages';


export default function ChatContainer() {


    return (
        <div className="chat-container">
            <div className="head">蜘蛛侠</div>
            <div className="message"><Messages /></div>
            <div className="edit-wrap">
                <div className="edit-tool">
                    <span className="face"></span>
                    <span className="file"></span>
                    <span className="screenshot"></span>
                    <span className="messages"></span>
                    <span className="video"></span>
                    <span className="phone"></span>
                </div>
                <textarea></textarea>
            </div>
        </div>
    );
}
