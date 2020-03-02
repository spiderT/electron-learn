import React from 'react';
import './index.scss';

export default function EmojiPackage(){

  const emojiArr = ['😊', '😢', '😄', '🔥', '👌', '👀', '🐦', '😯', '👎', '🤮', '🀄️', '😔'];

  return <div className="emoji-wrap">
    {emojiArr.map(item=><span className="emoji-item">{item}</span>)}
  </div>
}

