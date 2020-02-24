import React from 'react';
import './index.scss';
import MsgRender from '../../components/Message';

function render() {
    const msgData = [{
        type: 'tip',
        subType: 2,
        content: '10:29',
        fromId: 'zhizhuxia',
        toId: 'me'
    }, {
        type: 'text',
        subType: 1,
        content: '你好，我是蜘蛛侠，很高兴认识你。你好，我是蜘蛛侠，很高兴认识你。你好，我是蜘蛛侠，很高兴认识你。',
        fromId: 'zhizhuxia',
        toId: 'me',
    }, {
        type: 'text',
        subType: 1,
        content: '我也很高兴认识你',
        fromId: 'me',
        toId: 'zhizhuxia',
    }];

    const container = [];

    msgData.map(item=>{
        container.push(MsgRender(item))
    })
    console.log('container', container)
    return container
}

export default function Messages() {
    function getMsgContainer(){
        return render();
    }

    return (
        <div>{ getMsgContainer()}</div>
    )
}