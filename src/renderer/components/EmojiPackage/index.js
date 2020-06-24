import React from 'react';
import './index.scss';

export default function EmojiPackage(props) {
  const emojiArr = [
    '😊',
    '😢',
    '😄',
    '🔥',
    '👌',
    '👀',
    '🐦',
    '😯',
    '👎',
    '🤮',
    '🀄️',
    '😔',
    '😁',
    '👿',
    '🐢',
    '🐑',
    '🐎',
    '🐷',
    '😍',
    '❤️',
    '🌹',
    '💩',
    '👼',
    '🍦',
    '🍰',
    '🐻',
    '🍞',
    '🐼',
    '🐟',
    '🐬',
    '⛽️',
    '🏠',
    '🚗',
    '😼',
    '🚴‍',
    '🏃‍',
    '😯',
    '🐶',
    '👸',
    '🧙‍',
    '🌧️',
    '🌞',
  ];

  function sendEmoji(e, item) {
    e.stopPropagation();
    props.sendEmoji(item);
  }

  document.body.addEventListener(
    'click',
    (e) => {
      if (e.target.matches('.emoji-wrap *')) {
        return;
      }
      props.handleLeave();
    },
    false
  );

  return (
    <div className="emoji-wrap">
      {emojiArr.map((item, index) => (
        <span className="emoji-item" key={index} onClick={(e) => sendEmoji(e, item)}>
          {item}
        </span>
      ))}
    </div>
  );
}
