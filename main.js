const { app, BrowserWindow, Menu } = require('electron')
const createMenuTemplate = require('./desktop/menus');

const menuTemplate = createMenuTemplate();
const appMenu = Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(appMenu);



function createWindow () {   
  // 创建浏览器窗口
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // 加载index.html文件
<<<<<<< HEAD
  // win.loadFile('index.html')
  win.loadFile('http://127.0.0.1:9200/')
=======
  win.loadFile('index.html')
>>>>>>> 95ec32e2e09546fa342e964c5a710b0378c28c27
}

app.on('ready', createWindow)