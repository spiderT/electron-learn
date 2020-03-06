import React from 'react';
import './index.scss';

function User() {

    return (
        <div className="user-wrap">
            <div className="avatar"></div>
            <div className="chat active"></div>
            <div className="contacts"></div>
            <div className="collect"></div>
            <div className="phone"></div>
            <div className="setting"></div>
        </div>
    );
}

export default User;