
import React from 'react';
import Text from './Text';
import Tip from './Tip';
import Image from './Image';
import './index.scss';

const AvatarRender = (msg) => {
  return <img className="chat-avatar" src={require(`../../../resources/images/users/${msg.fromId === 'me' ? 'user': msg.fromId}.png`)} />
  // return <div>123</div>
}

const MsgRender = (msg) => {
    let content;
    switch (msg.type) {
      // 文本
      case 1: content = <Text content={msg.content} />; break;
      // 系统
      case 2: content = <Tip content={msg.content} />; break;
      // 图片
      case 3: content = <Image content={msg.content} />; break;
    }

    return (
      <div key={msg.id} className={`msg-item clearfix ${msg.type !== 2 ?(msg.fromId === 'me' ? 'right' : 'left'):''}`}>
        {msg.type !== 2 ? AvatarRender(msg) : null}
        {content}
      </div>
    );
};

export default MsgRender;
