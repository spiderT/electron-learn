import React, { useState } from 'react';
import Setting from './Setting.jsx';
import './index.scss';

function User() {
  const [visible, setVisible] = useState(false);
  function handleSetting() {
    setVisible(!visible);
  }
  return (
    <div className="user-wrap">
      <div className="avatar" />
      <div className="chat active" />
      <div className="contacts" />
      <div className="collect" />
      <div className="phone" />
      <div className="setting" onClick={handleSetting} />
      {visible && <Setting  handleSetting={handleSetting}/>}
    </div>
  );
}

export default User;
