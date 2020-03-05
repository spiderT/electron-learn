import React from 'react';
import './Image.scss';

const Image = (props) => {
  const content = props.content;
  return (
          <span className='msg-text' >
             {/* <img src={require(`${content ? content : '../../../../upload/default.png'}`)} /> */}
             {/* <img src={require(`${content}`)} /> */}
             <img src={require(`/Users/tangting006/Desktop/11.jpg`)} />
          </span>
  );
};

export default Image;