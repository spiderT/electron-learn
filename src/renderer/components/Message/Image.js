import React from 'react';
import './Image.scss';

const Image = (props) => {
  const content = props.content;
  return (
          <span className='msg-text' >
             {/* <img src={require(`${content ? content : '../../../../upload/default.png'}`)} /> */}
             <img src={require(`../../../../upload/default.png`)} />
          </span>
  );
};

export default Image;