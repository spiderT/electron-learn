import React from 'react';
import './index.scss';

function ListItem(user) {
    return (
        <div key={user.name} className="list-item">
            <div className="avatar"><img src={require(`../../../resources/images/users/${user.avatar}-big.png`)} /></div>
            <div className="info">
                <p className="name">{user.name}</p>
                <p className="message">{`您已添加了${user.name}，现在可以开始聊天了。`}</p>
            </div>
            <div className="time">20/03/21</div>
        </div>
    )
}

const users = [
    {
        name: '蜘蛛侠',
        avatar: 'zhizhuxia',
    }, {
        name: '小丑',
        avatar: 'xiaochou',
    }, {
        name: '蚁人',
        avatar: 'yiren',
    }, {
        name: '超人',
        avatar: 'chaoren',
    }, {
        name: '蝙蝠侠',
        avatar: 'bianfuxia',
    }, {
        name: '钢铁侠',
        avatar: 'gangtiexia',
    }, {
        name: '金刚狼',
        avatar: 'jinganglang',
    }, {
        name: '雷神',
        avatar: 'leishen',
    }, {
        name: '绿灯侠',
        avatar: 'lvdengxia',
    }, {
        name: '绿巨人',
        avatar: 'lvjuren',
    }, {
        name: '美国队长',
        avatar: 'meiguoduichang',
    }, {
        name: '圣诞老人',
        avatar: 'ren',
    }, {
        name: '闪电侠',
        avatar: 'shandianxia',
    }, {
        name: '死侍',
        avatar: 'sishi',
    }
]

export default function Chatlist() {


    return (
        <div className="list-wrap">
            {users.map(item => ListItem(item))}
        </div>
    );
}
