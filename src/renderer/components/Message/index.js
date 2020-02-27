
import React from 'react';
import Text from './Text';
import Tip from './Tip';
import './index.scss';

const AvatarRender = (msg) => {
  return <img className="chat-avatar" src={require(`../../../resources/images/users/${msg.fromId === 'me' ? 'user': msg.fromId}.png`)} />
  // return <div>123</div>
}

const MsgRender = (msg) => {
    let content;
    switch (msg.subType) {
      // 文本
      case 1: content = <Text content={msg.content} />; break;
      // 系统
      case 2: content = <Tip content={msg.content} />; break;
    }

    return (
      <div key={msg.id} className={`msg-item clearfix ${msg.subType === 1 ?(msg.fromId === 'me' ? 'right' : 'left'):''}`}>
        {msg.subType === 1 ? AvatarRender(msg) : null}
        {content}
      </div>
    );
};

export default MsgRender;
