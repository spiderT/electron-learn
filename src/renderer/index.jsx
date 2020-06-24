import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App.jsx';

import { ipcRenderer } from 'electron';

ipcRenderer.on('change-fontsize', (e, arg) => {
    const fonsize = 10 + arg * 0.08;
    const cls = ['font-size-10', 'font-size-12', 'font-size-14', 'font-size-16', 'font-size-18'];
    console.log('change-fontsize', arg, fonsize);
    document.getElementsByTagName('body')[0].classList.remove(...cls);
    document.getElementsByTagName('body')[0].classList.add(`font-size-${fonsize}`);
})

ReactDOM.render(<App />, document.getElementById('appRoot'));