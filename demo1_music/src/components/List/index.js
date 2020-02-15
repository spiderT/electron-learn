import React, { Component } from 'react';
import './index.css';

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: []
    }
  }

  render() {
    const { list } = this.state;
    return (
      <div className="list-wrap">
        {list.length ? list.map(item => <li>{item}</li>) : null}
      </div>)
  }
}