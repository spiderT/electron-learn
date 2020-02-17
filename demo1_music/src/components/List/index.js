import React, { Component } from 'react';
import './index.css';
import musics from './music.data';

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <div className="list-wrap">
        {musics.length ?
          musics.map(item =>
            <li key={item.name}>
              <span>{item.name}</span>
              <audio className="audio-play" src={item.path} />
            </li>) : null}
      </div>)
  }
}