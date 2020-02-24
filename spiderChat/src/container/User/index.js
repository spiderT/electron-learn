import React, {useState} from 'react';
import './index.scss';
const ipcRenderer = require('electron').ipcRenderer;

function User() {
    const [maxIconClass, setMaxIconClass] = useState('');
    function close(){
        ipcRenderer.send('window-close');
    }

    function min(){
        ipcRenderer.send('window-min');
    }

    function max(){
        ipcRenderer.send('window-max');
    }

    ipcRenderer.on('main-window-max', (event) => {
        console.log('icon-maxed');
        setMaxIconClass('icon-maxed')
    });

    ipcRenderer.on('main-window-unmax', (event) => {
        console.log('icon-max');
        setMaxIconClass('icon-max')
    });

    return (
        <div className="user-wrap">
            <div className="window-icon">
                <span className="close" onClick={close}></span>
                <span className="min" onClick={min}></span>
                <span className={`max ${maxIconClass}`} onClick={max}></span>
            </div>
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