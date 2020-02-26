import React from 'react';
import './Tip.scss';

const Tip = (props) => {
  return (
          <div className='msg-tip' >
             {props.content}
          </div>
  );
};

export default Tip;