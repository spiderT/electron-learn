import React from 'react';
import './Image.scss';

const Image = (props) => {
  const content = props.content;
  return (
          <span className='msg-text' >
             {/* base64格式图片 */}
             <img src={content} />
          </span>
  );
};

export default Image;