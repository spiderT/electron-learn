import React, {Component} from 'react';
import './index.css';

export default class UserInfo extends Component{
  constructor(props){
    super(props);
    this.state = {

    }
  }

  render(){
    return (
    <div className="user-wrap">
      <div className="user-img">头像</div>
      <div className="user-list">发现音乐</div>
      <div className="user-list">我喜欢的音乐</div>
    </div>)
  }
}