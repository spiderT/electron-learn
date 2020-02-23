
import React, { Component } from 'react';
import User from './container/User';
import Chat from './container/Chat';

export default class App extends Component {

  render() {
    return (
      <div className="wrap">
        <User />
        <Chat />
      </div>
    )
  }
}