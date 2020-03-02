import React from 'react';
import './index.scss';

export default function EmojiPackage(props){

  const emojiArr = ['😊', '😢', '😄', '🔥', '👌', '👀', '🐦', '😯', '👎', '🤮', '🀄️', '😔', 
  '😁', '👿', '🐢', '🐑', '🐎','🐷', '😍', '❤️', '🌹', '💩', '👼', '🍦', '🍰', '🐻', '🍞', 
  '🐼', '🐟', '🐬', '⛽️', '🏠', '🚗', '😼', '🚴‍', '🏃‍', '😯', '🐶', '👸', '🧙‍', '🌧️', '🌞'];

  function sendEmoji(e, item){
    e.stopPropagation();
    props.sendEmoji(item)
  }

  return <div className="emoji-wrap">
    {emojiArr.map((item, index)=><span className="emoji-item" key={index} onClick={(e)=>sendEmoji(e, item)}>{item}</span>)}
  </div>
}

