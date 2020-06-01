const {
    BrowserWindow,
    globalShortcut,
    ipcMain
} = require('electron');

const path = require('path');

let capWin;

//注册快捷键
function createShortcut() {
    globalShortcut.register('CmdOrCtrl+Shift+A', captureScreen)
    globalShortcut.register('Esc', () => {
        if (capWin) {
            capWin.close()
            capWin = null
        }
    })
    ipcMain.on('capture-screen', captureScreen)
}

function createCaptureWindow() {
    // 创建浏览器窗口，只允许创建一个
    console.log('capWin', capWin)
    if (capWin) return console.log('只能有一个CaptureWindow')
    const {
        screen
    } = require('electron') 
    const {
        width,
        height
    } = screen.getPrimaryDisplay().workAreaSize
    capWin = new BrowserWindow({
        // window 使用 fullscreen,  mac 设置为 undefined, 不可为 false
        // fullscreen: process.platform !== 'darwin' || undefined, // win
        // fullscreen: true,
        simpleFullscreen: true,
        width,
        height,
        x: 0,
        y: 0,
        transparent: true,
        frame: false,
        skipTaskbar: true,
        autoHideMenuBar: true,
        movable: false,
        resizable: false,
        enableLargerThanScreen: true, // mac
        hasShadow: false,
        alwaysOnTop: true,
        webPreferences: {
            nodeIntegration: true,
        }
    })

    capWin.setAlwaysOnTop(true, 'screen-saver') // mac
    capWin.setVisibleOnAllWorkspaces(true) // mac
    // capWin.setFullScreenable(false) // mac
    capWin.setSimpleFullScreen(true) // mac

    capWin.loadFile(path.join(__dirname, './index.html'))

    // // 打开开发者工具
    capWin.webContents.openDevTools()
    console.log('capWin.id', capWin.id);


    capWin.on('closed', () => {
        capWin = null
    })
}

function captureScreen() {
    createCaptureWindow()
}

ipcMain.on('clip-page', (event, {
    type,
    msg
}) => {
    if (type === 'close') {
        if (capWin) {
            // 解决图片自动粘贴问题
            setTimeout(function(){
                capWin.close()
                capWin = null
            },0)
        }
    }else if(type === 'paste'){
        console.log('paste22')
        event.sender.send('paste-from-clipboard', msg);
    }
})

exports.createShortcut = createShortcut
