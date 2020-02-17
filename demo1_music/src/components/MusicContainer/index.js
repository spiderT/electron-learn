import React, {Component} from 'react';
import './index.css';
import List from '../List';

export default class MusicContainer extends Component{
  constructor(props){
    super(props);
    this.state = {

    }
  }

  render(){
    return (
    <div className="music-wrap">
      music-wrap
      <List />
    </div>)
  }
}