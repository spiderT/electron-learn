import React, { useEffect, useContext } from 'react';
import { MyContext } from '../../context-manager';
import { SPIDER_MAN } from '../../constants';

import './index.scss';

const users = [
  {
    name: '蜘蛛侠',
    avatar: 'zhizhuxia',
  },
  {
    name: '小丑',
    avatar: 'xiaochou',
  },
  {
    name: '蚁人',
    avatar: 'yiren',
  },
  {
    name: '超人',
    avatar: 'chaoren',
  },
  {
    name: '蝙蝠侠',
    avatar: 'bianfuxia',
  },
  {
    name: '钢铁侠',
    avatar: 'gangtiexia',
  },
  {
    name: '金刚狼',
    avatar: 'jinganglang',
  },
  {
    name: '雷神',
    avatar: 'leishen',
  },
  {
    name: '绿灯侠',
    avatar: 'lvdengxia',
  },
  {
    name: '绿巨人',
    avatar: 'lvjuren',
  },
  {
    name: '美国队长',
    avatar: 'meiguoduichang',
  },
  {
    name: '圣诞老人',
    avatar: 'ren',
  },
  {
    name: '闪电侠',
    avatar: 'shandianxia',
  },
  {
    name: '死侍',
    avatar: 'sishi',
  },
];

export default function Chatlist(props) {
  console.log('props', props);

  useEffect(() => {
    fetchData();
  }, []);

  const { setMsgData } = useContext(MyContext);
  function renderCurMsg(user) {
    const msgData = props.msgData;
    if (msgData && msgData.length) {
      const last = msgData[msgData.length - 1];
      return last.type === 3 ? '[图片]' : last.content;
    } else {
      return `您已添加了${user.name}，现在可以开始聊天了。`;
    }
  }

  function ListItem(user) {
    return (
      <div key={user.name} className="list-item" onClick={getMsg.bind(this, user)}>
        <div className="avatar">
          <img src={require(`../../../resources/images/users/${user.avatar}-big.png`)} />
        </div>
        <div className="info">
          <p className="name">{user.name}</p>
          {user.avatar === SPIDER_MAN ? (
            <p className="message">{renderCurMsg(user)}</p>
          ) : (
            <p className="message">{`您已添加了${user.name}，现在可以开始聊天了。`}</p>
          )}
        </div>
        <div className="time">2021/06/25</div>
      </div>
    );
  }

  function fetchData() {
    fetch('http://127.0.0.1:1234/allmsgs')
      .then((response) => response.json())
      .then((response) => {
        setMsgData(response || []);
      })
      .catch((error) => console.log(error));
  }

  function getMsg(user) {
    if (user.avatar !== SPIDER_MAN) {
      return;
    }
    fetchData();
  }
  return <div className="list-wrap">{users.map((item) => ListItem(item))}</div>;
}
