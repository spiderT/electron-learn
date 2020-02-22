import React, { Component } from 'react';
import './index.css';
import musics from './music.data';
import { ipcRenderer } from 'electron';

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
    ipcRenderer.on('change-music', this.handlePlayMusic)
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