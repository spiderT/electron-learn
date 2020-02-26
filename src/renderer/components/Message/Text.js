import React from 'react';
import './Text.scss';

const Text = (props) => {
  return (
          <span className='msg-text' >
             {props.content}
          </span>
  );
};

export default Text;