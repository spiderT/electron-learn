
import React, {Component} from 'react';
import MusicContainer from './components/MusicContainer';
import UserInfo from './components/UserInfo';

export default class App extends Component{
  
   render(){
     return (
      <div>
        <UserInfo />
        <MusicContainer />
        </div>
     )
   }
}