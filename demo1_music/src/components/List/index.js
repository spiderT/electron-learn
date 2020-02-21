import React, { Component } from 'react';
import './index.css';
import musics from './music.data';

//在渲染器进程 (网页) 中。
const { ipcRenderer } = require('electron')

ipcRenderer.on('asynchronous-reply', (event, arg) => {
  console.log(arg) 
})



export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  handlePlayMusic = item => {
    console.log(item)
  }

  render() {
    return (
      <div className="list-wrap">
        {musics.length ?
          musics.map(item =>
            <li key={item.name} onClick={this.handlePlayMusic.bind(this, item.path)}>
              <span>{item.name}</span>
              <audio className="audio-play" src={item.path} />
            </li>) : null}
      </div>)
  }
}