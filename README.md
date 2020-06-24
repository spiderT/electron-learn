# electron-learn

官网：https://electronjs.org/

## 1. 本次项目功能点

模仿微信，做了一个单机版的聊天，因为只有mac，没有Windows机器，以下仅根据mac来开发。 

![效果图](images/xiaoguo.gif)

### 目前支持的功能点

1. 聊天  
2. 发送表情  
3. 选择文件（只支持选择图片）发送  
4. 截图发送  
5. 粘贴图片（只支持剪切板上粘贴图片）发送  
6. 根据当前设备主题自动切换深浅主题  
7. 设置里，调整字体大小  
8. 退出登录，含清除数据功能  
9. 启动updater-server 自动更新  

### 使用方式  

```text
git clone https://github.com/spiderT/electron-learn.git
cd electron-learn
npm install

// 消息存储服务端 koa+mongodb, 需要事先安装配置mongodb
git clone https://github.com/spiderT/koa-mongodb-learn.git
cd koa-mongodb-learn
npm install
node index.js

// 启动websocket模拟聊天
cd ws-server
node index.js
// 以live server的方式打开client.html，就可以愉快的聊天了

// 启动
npm start

// 如果需要启动crash报告收集，update服务
cd updater-server
node index.js
```

### 参考资料  

1. electron 优化 https://juejin.im/post/5e0010866fb9a015fd69c645  

Electron的主进程阻塞导致UI卡顿的问题 https://zhuanlan.zhihu.com/p/37050595  

2. 打包：mac 文件签名：https://www.cnblogs.com/lovesong/p/11782449.html  
https://www.cnblogs.com/qirui/p/8327812.html  

3. 集成c++  
 https://www.jianshu.com/p/93ffa05f028f  
 https://blog.csdn.net/wang839305939/article/details/83780789  
 https://www.jianshu.com/p/5a4c7ce2be54  
 https://www.dazhuanlan.com/2019/09/23/5d88a0bc8ec13/  
 https://stackoverflow.com/questions/32986826/calling-node-native-addons-c-in-electron  

4. 奔溃报告上传  https://juejin.im/post/5c5ee47be51d457f95354c82  
 https://www.electronjs.org/docs/api/crash-reporter   

5. debugger https://cloud.tencent.com/developer/section/1116142   

6. 测试和调试 https://www.bookstack.cn/read/electron-v6.0-zh/dda8a7a000404b49.md  


## 2. electron相关软件安装

### nvm 安装

```text
Mac/Linux: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh | bash
Windows: https://github.com/coreybutler/nvm-windows/releasesa
验证nvm: nvm --versiona
```

### Node.js/NPM 安装

```text
安装 Node.js: nvm install 12.14.0
切换 Node.js 版本:nvm use 12.14.0
验证 npm -v
验证 node -v
```

### node 安装加速机器

```text
// mac 在 .bashrc 或者 .zshrc 加入
export NVM_NODEJS_ORG_MIRROR=http://npm.taobao.org/mirrors/node

// Windows 在 %userprofile%\AppData\Roaming\nvm\setting.txt 加入
node_mirror: https://npm.taobao.org/mirrors/node/ npm_mirror: https://npm.taobao.org/mirrors/npm/
```

### Electron 安装

```text
npm install electron --save-dev
npm install --arch=ia32 --platform=win32 electron

// 验证安装成功:
npx electron -v (npm > 5.2)
./node_modules/.bin/electron -v
```

### Electron 加速技巧

```text
# 设置ELECTRON_MIRROR
ELECTRON_MIRROR=https://cdn.npm.taobao.org/dist/electron/ npm install electron --save- dev
```

## 3. electron 原理

Node.js 和 Chromiums 整合

- Chromium 集成到 Node.js: 用 libuv 实现 messagebump (nw)

- 难点:Node.js 事件循环基于 libuv，但 Chromium 基于 message bump

Node.js 集成到 Chromium

![chromium](images/chromium.png)
![electron](images/electron.png)


### 2.1. 使用 Electron 的 API

Electron 在主进程和渲染进程中提供了大量 API 去帮助开发桌面应用程序， 在主进程和渲染进程中，你可以通过 require 的方式将其包含在模块中以此，获取 Electron 的 API

```js
const electron = require('electron');
```

所有 Electron 的 API 都被指派给一种进程类型。 许多 API 只能被用于主进程或渲染进程中，但其中一些 API 可以同时在上述两种进程中使用。 每一个 API 的文档都将声明你可以在哪种进程中使用该 API。

Electron 中的窗口是使用 BrowserWindow 类型创建的一个实例， 它只能在主进程中使用。

```js
// 这样写在主进程会有用，但是在渲染进程中会提示'未定义'
const { BrowserWindow } = require('electron');

const win = new BrowserWindow();
```

因为进程之间的通信是被允许的, 所以渲染进程可以调用主进程来执行任务。 Electron 通过 remote 模块暴露一些通常只能在主进程中获取到的 API。 为了在渲染进程中创建一个 BrowserWindow 的实例，我们通常使用 remote 模块为中间件：

```js
//这样写在渲染进程中时行得通的，但是在主进程中是'未定义'
const { remote } = require('electron');
const { BrowserWindow } = remote;

const win = new BrowserWindow();
```

### 3.2. 使用 Node.js 的 API

Electron 同时对主进程和渲染进程暴露了 Node.js 所有的接口。 这里有两个重要的定义：

1. 所有在 Node.js 可以使用的 API，在 Electron 中同样可以使用。 在 Electron 中调用如下代码是有用的：

```js
const fs = require('fs');

const root = fs.readdirSync('/');

// 这会打印出磁盘根级别的所有文件
// 同时包含'/'和'C:\'。
console.log(root);
```

正如您可能已经猜到的那样，如果您尝试加载远程内容， 这会带来重要的安全隐患。 您可以在我们的 安全文档 中找到更多有关加载远程内容的信息和指南。

2)你可以在你的应用程序中使用 Node.js 的模块。 选择您最喜欢的 npm 模块。 npm 提供了目前世界上最大的开源代码库，那里包含良好的维护、经过测试的代码，提供给服务器应用程序的特色功能也提供给 Electron。

例如，在你的应用程序中要使用官方的 AWS SDK，你需要首先安装它的依赖：

npm install --save aws-sdk
然后在你的 Electron 应用中，通过 require 引入并使用该模块，就像构建 Node.js 应用程序那样：

```js
// 准备好被使用的S3 client模块
const S3 = require('aws-sdk/clients/s3');
```

有一个非常重要的提示: 原生 Node.js 模块 (即指，需要编译源码过后才能被使用的模块) 需要在编译后才能和 Electron 一起使用。

绝大多数的 Node.js 模块都不是原生的， 在 650000 个模块中只有 400 是原生的。

## 4. electron 常用 api

### 4.1. app

进程： Main  
用于控制应用生命周期。  
 
ready: 当 Electron 完成初始化时被触发。  

will-finish-launching: 当应用程序完成基础的启动的时候被触发。常会在这里为 open-file 和 open-url 设置监听器，并启动崩溃报告和自动更新。  

activate: 当应用被激活时触发，常用于点击应用的 dock 图标的时候。  

window-all-closed: 当所有的窗口都被关闭时触发。如果没有监听此事件，当所有窗口都已关闭时，默认行为是退出应用程序。  


```js
const { app } = require('electron')

app.on('second-instance', show);

app.on('will-finish-launching', () => {
  // 自动更新
  if (!isDev) {
    require('./src/main/updater.js');
  }
  require('./src/main/crash-reporter').init();
});

app.on('ready', () => {
  // 模拟crash
  // process.crash();
  const win = createWindow();
  setTray();
  handleIPC();
  handleDownload(win);
});

app.on('activate', show);

app.on('before-quit', close);

app.on('will-quit', () => {
  // Unregister all shortcuts.
  globalShortcut.unregisterAll();
});
app.on('window-all-closed', () => {
  app.quit()
})


```

### 4.2. BrowserWindow

进程： Main  
创建和控制浏览器窗口。  

```js
win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      nodeIntegration: true
    },
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: 'hiddenInset',
    show: false, // 先隐藏
    icon: path.join(__dirname, '../../resources/images/zhizhuxia.png'),
    backgroundColor: '#f3f3f3', // 优化白屏，设置窗口底色
  })
```

BrowserWindow——无边框  

1、BrowserWindow 的 options 中将 frame 设置为 false。  

macOS 上的其他方案：  
2、titleBarStyle设为hidden，返回一个隐藏标题栏的全尺寸内容窗口，在左上角仍然有标准的窗口控制按钮。  

3、titleBarStyle设为hiddenInset，返回一个另一种隐藏了标题栏的窗口，其中控制按钮到窗口边框的距离更大。  

4、customButtonsOnHover  
使用自定义的关闭、缩小和全屏按钮，这些按钮会在划过窗口的左上角时显示。  

5、透明窗口：通过将 transparent 选项设置为 true, 还可以使无框窗口透明:  

默认情况下, 无边框窗口是不可拖拽的。 需要在 CSS 中指定 -webkit-app-region: drag 来告诉 Electron 哪些区域是可拖拽的。  

### 4.3. ipcMain 和 ipcRenderer

1. 主进程和渲染进程之间的区别

主进程使用 BrowserWindow 实例创建页面。 每个 BrowserWindow 实例都在自己的渲染进程里运行页面。 当一个 BrowserWindow 实例被销毁后，相应的渲染进程也会被终止。

主进程管理所有的 web 页面和它们对应的渲染进程。 每个渲染进程都是独立的，它只关心它所运行的 web 页面。

在页面中调用与 GUI 相关的原生 API 是不被允许的，因为在 web 页面里操作原生的 GUI 资源是非常危险的，而且容易造成资源泄露。 如果你想在 web 页面里使用 GUI 操作，其对应的渲染进程必须与主进程进行通讯，请求主进程进行相关的 GUI 操作。

Electron 为主进程（ main process）和渲染器进程（renderer processes）通信提供了多种实现方式，如可以使用 ipcRenderer 和 ipcMain 模块发送消息，使用 remote 模块进行 RPC 方式通信

![渲染进程和主进程](images/ipcRenderer.png)

2. Electron 渲染进程

```js
// 引入模块，各进程直接在electron模块引入即可。例子:
const { app, BrowserWindow } = require(‘electron’) // 主进程引入app, BrowserWindow模块

const { ipcRenderer } = require(‘electron’) // 渲染进程引入ipcRenderer
ipcRenderer.invoke(channel, ...args).then(result => { handleResult }) // 渲染进程跟主进程发送请求
```

- 展示 Web 页面的进程称为渲染进程

- 通过 Node.js、Electron 提供的 API 可以跟系统底层打交道

- 一个 Electron 应用可以有多个渲染进程

3. Electron 主进程

ipcMain.handle(channel, handler)，处理理渲染进程的 channel 请求，在 handler 中 return 返回结果

- Electron 运行 package.json 的 main 脚本的进程被称为主进程

- 每个应用只有一个主进程

- 管理原生 GUI，典型的窗口(BrowserWindow、Tray、Dock、Menu)

- 创建渲染进程

- 控制应用生命周期(app)

![渲染进程和主进程](images/ipcRenderer2.png)

4. 进程间通信

1） IPC 模块通信  

- Electron 提供了 IPC 通信模块，主进程的 ipcMain 和 渲染进程的 ipcRenderer  
- ipcMain、ipcRenderer 都是 EventEmitter 对象  

2） 进程间通信:从渲染进程到主进程  

- Callback 写法:  
ipcRenderer.send  
ipcMain.on  

- Promise 写法 (Electron 7.0 之后，处理请求 + 响应模式)  
ipcRenderer.invoke   
ipcMain.handle  

3） 进程间通信:从主进程到渲染进程  

- 主进程通知渲染进程:  
ipcRenderer.on  
webContents.send  

4）页面间(渲染进程与渲染进程间)通信  

- 通知事件  
  
通过主进程转发(Electron 5之前)  
ipcRenderer.sendTo (Electron 5之后) 数据共享  

窗口A的渲染进程发消息给主进程  

```js
ipcRenderer.send('imgUploadMain', {
                id: dom.id,
                siteId: this.siteId,
                url: dom.src
            });
```

主进程收到消息后，再发消息给窗口B的渲染进程  

```js
ipcMain.on('imgUploadMain', (event, message) => {
  mainWindow.webContents.send('imgUploadMsgFromMain', message);
});
```

窗口B渲染进程接收主进程消息的代码：  

```js
ipcRenderer.on('imgUploadMsgFromMain', (e, message) => this.imgUploadCb(message));
```

- 数据共享  

Web 技术(localStorage、sessionStorage、indexedDB)  
使用 remote  

**注意**  

- 少用 remote 模块  
- 不要用 sync 模式  
- 在请求 + 响应的通信模式下，需要自定义超时限制  

### 4.4. Menu/MenuItem(菜单/菜单项)

1. 新建菜单

```js
const menu = new Menu()
```

2. 新建菜单项  

```js
const menuItem1 = new MenuItem({ label: '复制', role: 'copy' })
const menuItem2 = new MenuItem({ label: '菜单项名', click: handler, enabled, visible,
type: normal | separator | submenu | checkbox | radio,
role: copy | paste | cut | quit | ... 
})
```

3. 添加菜单项

```js
menu.append(menuItem1)
menu.append(new MenuItem({ type: 'separator' })) 
menu.append(menuItem2)
```

4. 弹出右键菜单

```js
menu.popup({ window: remote.getCurrentWindow() })
```

5. 设置应用菜单栏

```js
app.applicationMenu = appMenu;
```

### 4.5. Tray(托盘)

1. 方法  

- 创建托盘  

```js
tray = new Tray('/path/to/my/icon')
```
Mac图片建议保留 1倍图(32 * 32)，2倍图@2x(64 * 64)   
Windows使用ico格式   
大部分Mac托盘都是偏黑色的、Windows则是彩色的 Mac  

- 弹出托盘菜单

```js
const contextMenu = Menu.buildFromTemplate([ 
  { label: '显示', click: () => {showMainWindow()}}, 
  { label: '退出', role: 'quit'}}
]) 
tray.popUpContextMenu(contextMenu)
```

2. 事件  

'click':点击托盘  
'right-click':右击托盘  
'drop-files':文件拖拽。类似的还有drop-text  
'balloon-click':托盘气泡被点击(Windows特性)

### 4.6. clipboard 

在系统剪贴板上执行复制和粘贴操作。

```js
const { clipboard, nativeImage } = require('electron')

// 将 image 写入剪贴板
const dataUrl = this.selectRectMeta.base64Data
const img = nativeImage.createFromDataURL(dataUrl)
clipboard.writeImage(img)

// 自动粘贴剪贴板上的图片
function handlePaste(e) {
  const cbd = e.clipboardData
  if (!(e.clipboardData && e.clipboardData.items)) {
    return
  }
  for (let i = 0; i < cbd.items.length; i++) {
    const item = cbd.items[i]
    if (item.kind == 'file') {
      const blob = item.getAsFile()
      if (blob.size === 0) {
        return
      }
      const reader = new FileReader()
      const imgs = new Image()
      imgs.file = blob
      reader.onload = (e) => {
        const imgPath = e.target.result
        imgs.src = imgPath
        const eleHtml = `${html}<img src='${imgPath}'/>`
        setHtml(eleHtml)
      }
      reader.readAsDataURL(blob)
    }
  }
}

```


### 4.7. screen 

检索有关屏幕大小、显示器、光标位置等的信息。

```js
// 创建填充整个屏幕的窗口的示例:
const { app, BrowserWindow, screen } = require('electron')

let win
app.on('ready', () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  win = new BrowserWindow({ width, height })
  win.loadURL('https://github.com')
})

```


### 4.8. globalShortcut 

系统快捷键，监听键盘事件  

globalShortcut 模块可以在操作系统中注册/注销全局快捷键, 以便可以为操作定制各种快捷键。  

>注意: 快捷方式是全局的; 即使应用程序没有键盘焦点, 它也仍然在持续监听键盘事件。 在应用程序模块发出 ready  事件之前, 不应使用此模块。

```js
const { app, globalShortcut } = require('electron')

app.on('ready', () => {
  // 注册一个 'CommandOrControl+X' 的全局快捷键
  const ret = globalShortcut.register('CommandOrControl+X', () => {
    console.log('CommandOrControl+X is pressed')
  })

  if (!ret) {
    console.log('registration failed')
  }

  // 检查快捷键是否注册成功
  console.log(globalShortcut.isRegistered('CommandOrControl+X'))
})

app.on('will-quit', () => {
  // 注销快捷键
  globalShortcut.unregister('CommandOrControl+X')

  // 注销所有快捷键
  globalShortcut.unregisterAll()
})

```

### 4.9. desktopCapturer 

用于从桌面上捕获音频和视频的媒体源信息。

```js
desktopCapturer.getSources({
    types: ['screen', 'window'],
    thumbnailSize: {
        width,
        height
    }
}).then(
    async (sources) => {
        const screenImgUrl = sources[0].thumbnail.toDataURL()

        const bg = document.querySelector('.bg')
        const rect = document.querySelector('.rect')
        const sizeInfo = document.querySelector('.size-info')
        const toolbar = document.querySelector('.toolbar')
        const draw = new Draw(screenImgUrl, bg, width, height, rect, sizeInfo, toolbar)
        document.addEventListener('mousedown', draw.startRect.bind(draw))
        document.addEventListener('mousemove', draw.drawingRect.bind(draw))
        document.addEventListener('mouseup', draw.endRect.bind(draw))
    }
).catch(err => console.log('err', err))
```

### 4.10. shell 

使用默认应用程序管理文件和 url。  

shell 模块提供与桌面集成相关的功能。  

在用户的默认浏览器中打开 URL 的示例:  

```js
const { shell } = require('electron')

shell.openExternal('https://github.com')

```

##### 方法

shell.showItemInFolder(fullPath)  
fullPath String  
在文件管理器中显示给定的文件。如果可以, 选中该文件。  

shell.openItem(fullPath)   
fullPath String  
返回 Boolean - 文件是否成功打开,以桌面的默认方式打开给定的文件。    

shell.beep()  
播放哔哔的声音.  


### 4.11. powerMonitor 电源监视器

> 监视电源状态的改变。  

https://www.electronjs.org/docs/api/power-monitor


### 4.12. 使用 Node.js 获得底层能力

- Electron 同时在主进程和渲染进程中对 Node.js 暴露了所有的接口

fs 进行文件读写
crypto 进行加解密

- 通过 npm 安装即可引入社区上所有的 Node.js 库

### 4.13. 使用 Node.js 调用原生模块

- node.js add-on  
- node-ffi  


## 5. 开机自启动 

### 5.1. [node-auto-launch](https://github.com/Teamwork/node-auto-launch)

主进程main.js：  

```js
const AutoLaunch = require('auto-launch');
const demo = new AutoLaunch({
    name: 'demo',
    //path: '/Applications/Minecraft.app',
});
```

官方的范例里面写上了这个path。不写的话，是自动获取。写上的话，就是个固定的字符串。这个路径值很显然并不是固定的。

加入开机启动项  

```js
demo.enable();
```

移除开机启动项  

```js
demo.disable();
```

检测开机启动项状态  

```js
demo.isEnabled().then(function(isEnabled){
  if(isEnabled){
    return;
  }
  //demo.enable();
})
.catch(function(err){
  // handle error
});
```

> 升级mac系统到catalina后报错  

```text
<rejected> Error: 36:145: execution error: “System Events”遇到一个错误：应用程序没有运行。 (-600)
  
      at ChildProcess.<anonymous> (/Users/tangting/tt/github/electron-learn/node_modules/applescript/lib/applescript.js:49:13)
      at ChildProcess.emit (events.js:223:5)
      at Process.ChildProcess._handle.onexit (internal/child_process.js:272:12) {
    appleScript: 'tell application "System Events" to make login item at end with properties {path:"/Applications/spiderchat.app", hidden:false, name:"spiderchat"}',
    exitCode: 1
  }
}
```

### 5.2. app.getLoginItemSettings([options])  

options 的值  

openAtLogin Boolean - true 如果应用程序设置为在登录时打开, 则设为true  
openAsHidden Boolean macOS - true 表示应用在登录时以隐藏的方式启动。 该配置在 MAS 构建 时不可用。  
wasOpenedAtLogin Boolean macOS - true 表示应用在自动登录后已经启动。 该配置在 MAS 构建 时不可用。  
wasOpenedAsHiddenBoolean macOS - 如果应用在登录时已经隐藏启动, 则为 true。 这表示应用程序在启动时不应打开任何窗口。 该配置在 MAS 构建 时不可用。  
restoreState Boolean macOS - true 表示应用作为登录启动项并且需要恢复之前的会话状态。 这表示程序应该还原上次关闭时打开的窗口。 该配置在 MAS 构建 时不可用。  

## 6. 监控—crashReporter

可以用process.crash()模拟崩溃  

崩溃报告发送 multipart/form-data POST 型的数据给 submitURL:  

```js
//  客户端
crashReporter.start({
  productName: 'spiderchat',
  companyName: 'spiderT',
  submitURL: 'http://127.0.0.1:9999/crash',
})

// 服务端
const multer = require('koa-multer')
const uploadCrash = multer({
    dest: 'crash/'
})
router.post('/crash', uploadCrash.single('upload_file_minidump'), (ctx, next) => {
    console.log('crash', ctx.req.body)
    // todo 存DB
})
```

崩溃报告解析

下载并解压 symbol https://github.com/electron/electron/releases  

• Mac electron-vX.X.X-darwin-x64-symbols.zip  

• Win electron-vX.X.X-win32-ia32-symbols.zip   

 解析 dmp 文件  

• node-minidump  

```js
const minidump = require('minidump');
const fs = require('fs');

// symbolpath
minidump.addSymbolPath('/Users/tangting/tt/soft/electron-v9/breakpad_symbols/');

minidump.walkStack('./crash/aebd0e03e9f27f8e9d111f3aa8b67409',(err, res)=>{
    fs.writeFileSync('./error.txt', res);
})
```


## 7. 打包

### 7.1. [electron-builder](https://github.com/electron-userland/electron-builder)

https://juejin.im/post/5bc53aade51d453df0447927  

1. 在 package.json 应用程序中指定的标准字段 — name, description, version and author.

2. 在 package.json 添加 build 配置:

```json
"build": {
  "appId": "your.id",
  "mac": {
    "category": "your.app.category.type"
  }
}
```

See all options. Option files to indicate which files should be packed in the final application, including the entry file, maybe required.

3. 添加 icons.

制作 icns 图标

- brew install makeicns

- makeicns -in input.jpg -output out.icns

4. 在 package.json 添加 scripts 命令:

```json
"scripts": {
  "pack": "electron-builder --dir",
  "dist": "electron-builder"
}
```

#### 命令行参数（CLI）

- Commands(命令):

```text
  electron-builder build                    构建命名                      [default]
  electron-builder install-app-deps         下载app依赖
  electron-builder node-gyp-rebuild         重建自己的本机代码
  electron-builder create-self-signed-cert  为Windows应用程序创建自签名代码签名证书
  electron-builder start                    使用electronic-webpack在开发模式下运行应用程序(须臾要electron-webpack模块支持)

```

- Building(构建参数):

```text
  --mac, -m, -o, --macos   Build for macOS,                              [array]
  --linux, -l              Build for Linux                               [array]
  --win, -w, --windows     Build for Windows                             [array]
  --x64                    Build for x64 (64位安装包)                     [boolean]
  --ia32                   Build for ia32(32位安装包)                     [boolean]
  --armv7l                 Build for armv7l                              [boolean]
  --arm64                  Build for arm64                               [boolean]
  --dir                    Build unpacked dir. Useful to test.           [boolean]
  --prepackaged, --pd      预打包应用程序的路径（以可分发的格式打包）
  --projectDir, --project  项目目录的路径。 默认为当前工作目录。
  --config, -c             配置文件路径。 默认为`electron-builder.yml`（或`js`，或`js5`)

```

- Publishing(发布):

```text
  --publish, -p  发布到GitHub Releases [choices: "onTag", "onTagOrDraft", "always", "never", undefined]

```

- Other(其他):

```text
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
```

- Examples(例子):

```text
  electron-builder -mwl                        为macOS，Windows和Linux构建（同时构建）
  electron-builder --linux deb tar.xz          为Linux构建deb和tar.xz
  electron-builder -c.extraMetadata.foo=bar    将package.js属性`foo`设置为`bar`
  electron-builder --config.nsis.unicode=false 为NSIS配置unicode选项

```

- TargetConfiguration(构建目标配置):

```js
target:  String - 目标名称，例如snap.
arch “x64” | “ia32” | “armv7l” | “arm64”> | “x64” | “ia32” | “armv7l” | “arm64”  -arch支持列表

```

## 8. 集成c++

安装  

```js

npm install -g --production windows-build-tools

npm install -g node-gyp

```

写c++, 来自 node 官网文档   

```c

#include <node.h>

namespace demo {

using v8::FunctionCallbackInfo;

using v8::Isolate;

using v8::Local;

using v8::Object;

using v8::String;

using v8::Value;

void Method(const FunctionCallbackInfo& args) {  

    Isolate* isolate = args.GetIsolate();  

    args.GetReturnValue().Set(String::NewFromUtf8(isolate, "world"));

}

void init(Localexports) {

    NODE_SET_METHOD(exports, "hello", Method);

}

NODE_MODULE(addon, init)

}  // namespace demo

```

加个配置文件binding.gyp  

```json
{
  "targets": [{
    "target_name": "addon",
    "sources": [ "hello.cc"]
  }]
}
```

然后  

```js
node-gyp configure
npm install
```

在js里使用  

```js
var addon = require("./build/Release/addon");
console.log(addon.hello());
```

## 9. 测试和调试

### 9.1. 调试debug

1. 渲染进程调试  

win.webContents.openDevTools()  

打开控制台，跟web页面调试一样


2. 主进程调试

./node_modules/.bin/electron . --inspect=[port]         //port 不设置，默认是5858  

通过访问 chrome://inspect 来连接 Chrome 并在那里选择需要检查的Electron 应用程序    


### 9.2. 自动化测试

1. [spectron](https://www.electronjs.org/spectron)  

```js
# Install Spectron
$ npm install --save-dev spectron

// A simple test to verify a visible window is opened with a title
var Application = require('spectron').Application
var assert = require('assert')

var app = new Application({
  path: '/Applications/MyApp.app/Contents/MacOS/MyApp'
})

app.start().then(function () {
  // Check if the window is visible
  return app.browserWindow.isVisible()
}).then(function (isVisible) {
  // Verify the window is visible
  assert.equal(isVisible, true)
}).then(function () {
  // Get the window's title
  return app.client.getTitle()
}).then(function (title) {
  // Verify the window's title
  assert.equal(title, 'My App')
}).then(function () {
  // Stop the application
  return app.stop()
}).catch(function (error) {
  // Log any failures
  console.error('Test failed', error.message)
})
```

2. [WebDriverJs](https://code.google.com/p/selenium/wiki/WebDriverJs)

```js
const webdriver = require('selenium-webdriver')
const driver = new webdriver.Builder()
  // "9515" 是ChromeDriver使用的端口
  .usingServer('http://localhost:9515')
  .withCapabilities({
    chromeOptions: {
      // 这里设置Electron的路径
      binary: '/Path-to-Your-App.app/Contents/MacOS/Electron'
    }
  })
  .forBrowser('electron')
  .build()
driver.get('http://www.google.com')
driver.findElement(webdriver.By.name('q')).sendKeys('webdriver')
driver.findElement(webdriver.By.name('btnG')).click()
driver.wait(() => {
  return driver.getTitle().then((title) => {
    return title === 'webdriver - Google Search'
  })
}, 1000)
driver.quit()
```

## 10. 更新

客户端使用autoUpdater

```js
const {
    autoUpdater,
    app,
    dialog
} = require('electron');

if (process.platform == 'darwin') {
    autoUpdater.setFeedURL('http://127.0.0.1:9999/darwin?version=' + app.getVersion())
} else {
    autoUpdater.setFeedURL('http://127.0.0.1:9999/win32?version=' + app.getVersion())
}

// 定时轮训、服务端推送
autoUpdater.checkForUpdates(); 
autoUpdater.on('update-available', () => {
    console.log('update-available')
})

autoUpdater.on('update-downloaded', (e, notes, version) => {
    // 提醒用户更新
    app.whenReady().then(() => {
        const clickId = dialog.showMessageBoxSync({
            type: 'info',
            title: '升级提示',
            message: '已为你升级到最新版，是否立即体验',
            buttons: ['马上升级', '手动重启'],
            cancelId: 1,
        })
        if (clickId === 0) {
            autoUpdater.quitAndInstall()
            app.quit()
        }
    })
})

autoUpdater.on('error', (err) => {
    console.log('error', err)
})
```

服务端

```js
function getNewVersion(version) {
  if (!version) return null;
  const maxVersion = {
    name: '1.0.1',
    pub_date: '2020-06-09T12:26:53+1:00',
    notes: '新增功能: 菜单栏改成红色',
    url: `http://127.0.0.1:9999/public/spiderchat-1.0.1-mac.zip`,
  };
  if (compareVersions.compare(maxVersion.name, version, '>')) {
    return maxVersion;
  }
  return null;
}

router.get('/darwin', (ctx, next) => {
  // 处理Mac更新, ?version=1.0.0&uid=123
  const { version } = ctx.query;
  const newVersion = getNewVersion(version);
  if (newVersion) {
    ctx.body = newVersion;
  } else {
    ctx.status = 204;
  }
});
```

## 11. Electron客户端的安全：从xss到rce



## 12. 浏览器启动客户端

> 原理  
浏览器在解析url的时候，会尝试从系统本地寻找url协议所关联的应用，如果有关联的应用，则尝试打开这个应用  

### 12.1. windows平台

在windows下，注册一个协议比较简单，写注册表就可以了。参考 Registering an Application to a URI Scheme：https://docs.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/platform-apis/aa767914(v=vs.85)

### 12.2. mac 平台

几个基本概念

#### 12.2.1. info.plist

iOS和MacOS的应用包中，都有一个info.plist文件，这个文件主要用来记录应用的一些meta信息，参考[Information Property List](https://developer.apple.com/documentation/bundleresources/information_property_list)。文件用键值对的形式来记录信息(xml)，结构如下：

**CFBundleURLTypes**  

A list of URL schemes (http, ftp, and so on) supported by the app.

其实就是info.plist里面的一个key，对应的value是一个数组。可以通过这个字段来为应用注册一个 or 多个 URL Schema。参考[CFBundleURLTypes](https://developer.apple.com/documentation/bundleresources/information_property_list/cfbundleurltypes#details)

> 修改info.plist文件  

只需为App包中info.plist，设置CFBundleURLTypes的值即可.  https://zhuanlan.zhihu.com/p/76172940  

通过 extendInfo 中添加数组, 数组中的 值将会被写入 Info.plist 文件中。

```json
"build": {
    "appId": "com.spider.chat",
    "mac": {
      "category": "spider",
      "icon": "src/resources/icns/spider.icns",
      "extendInfo": {
        "CFBundleURLSchemes": [
          "spiderlink"
        ]
      }
    },
```

### 12.3. 接收参数

协议注册完毕之后，我们已经可以在浏览器中，通过访问自定义协议url来启动客户端了。  

对于url中的不同参数，客户端的行为也是不一样的，例如vscode:extension/ms-python.python这个url，启动了VsCode的同时也告诉了VsCode：我要安装插件，插件名是ms-phthon.python。  

Vscode通过解析url中的参数来实现自定义行为，那么作为客户端如何拿到这个url呢？  

### 12.3.1. Windows

参数会通过启动参数的形式传递给应用程序。因此，我们可以很方便的拿到这个参数

```js
// 通过自定义url启动客户端时
console.log(process.argv);

// 打印出
[
 'C://your-app.exe', // 启动路径
 'kujiale://111',  // 启动的自定义url
]
```

### 12.3.2. MacOS

在Mac下不会通过启动参数传递给应用，通过自定义协议打开应用，app会收到 open-url 事件

```js
// mac下通过kujiale协议启动应用
app.on('open-url', (e, url) => { // eslint-disable-line
  parse(url)； 解析url
});
```


## 13. 性能优化

### 13.1. 减少包体积大小

yarn autoclean -I  

yarn autoclean -F  



## Electron 开发过程中可能会遇到的几个问题和场景。

- 启动时间优化  
Electron 应用创建窗口之后，由于需要初始化窗口，加载 html，js 以及各种依赖，会出现一个短暂的白屏。除了传统的，比如说延迟 js 加载等 web 性能优化的方法，在 Electron 中还可以使用一种方式，就是在 close 窗口之前缓存 index 页面，下次再打开窗口的时候直接加载缓存好的页面，这样就会提前页面渲染的时间，缩短白屏时间。  

但是，优化之后也还是会有白屏出现，对于这段时间可以用一个比较 tricky 的方法，就是让窗口监听 ready-to-show 事件，等到页面完成首次绘制后，再显示窗口。这样，虽然延迟了窗口显示时间，总归不会有白屏出现了。  

1. 在 ready-to-show 时候再显示    
  设置窗口底色   

2. [实现占位图](https://github.com/dengyaolong/electron-loading-window-example)  

BrowserView、BrowserWindow、ChildWindow

-  CPU 密集型任务处理  
对于 cpu 密集型或者 long-running 的 task，我们肯定不希望它们阻塞主进程或者影响渲染进程页面的渲染，这时候就需要在其他进程中执行这些任务。通常有三种方式：  

1. 使用 child_process 模块，spawn 或者 fork 一个子进程；    
2. WebWorker；  
3. Backgroundprocess。在 Electron 应用中，我们可以创建一个隐藏的 Browser Window 作为 background process，这种方法的优势就在于它本身就是一个渲染进程，所以可以使用 Electron 和 Node.js 提供的所有 api。    

- 数据持久化存储  
为了使应用在 offline 的情况下也可以正常运行，对于桌面应用，我们会将一些数据存储到本地，常见方式有：  

localStorage。对于渲染进程中的数据，可以存到 localStorage 中。需要注意的是主进程是无法获取的。  
嵌入式数据库。我们也可以直接打包一个嵌入式数据库到应用中，比如说 SQLite，nedb，这种方式比较适合大规模数据的存储以及增删改查。  
对于简易的配置或者用户数据，可以使用 electron-config 等模块，将数据以 JSON 格式保存到文件中。  

- 安全性考虑  
在 Electron 应用中，web 页面是可以直接调用 Node.js api 的，这样就可以做很多事情，比如说操作文件系统，但同时也会带来安全隐患，建议大家渲染进程中禁用 NodeJS 集成。  

如果需要在页面中使用 node 或者 electron 的 api，可以通过提前加载一个 preload.js 作为 bridge，这个 js 会在所有页面 js 运行前被执行。我们可以在里面做很多事情，比如说把需要的 node 方法放到 global 或者 window 中，这样页面中就没办法直接使用 node 模块，但是又可以使用需要的某些功能，如下图所示。  

Electron在DevTools中的探索与实践  

除此之外，还要注意，使用安全的协议，比如说 https 加载外部资源。在 Electron 应用中，可以通过监听新窗口创建和页面跳转事件，判断是否是安全跳转，加以限制。亦可以通过设置 CSP，对指定 URL 的访问进行约束。  

- 应用体积优化  
对于 Electron 应用打包，首先会使用 webpack 分别对主进程和渲染进程代码进行处理优化，和 web 应用一样。有点区别的地方是配置中主进程的 target 是 electron-main, 渲染进程的 target 是 electron-renderer。除此之外，还要对 node 做一些配置，我们是不需要 webpack 来 polyfill 或者 mocknode 的全局变量和模块的，所以设为 false。  

之后，在基于 electron-builder 将应用 build 成不同平台的安装包，需要注意的是，对于 package.json，尽可能地把可以打包到 bundle 的依赖模块，从 dependencies 移到 devDependencies，因为所有 dependencies 中的模块都会被打到安装包中，会严重增大安装包体积。

##### NPM 下载的问题

因为 NPM 在国内比较慢。导致 electron-V.xxxx.zip 下载失败。这些东西如果是第一次打包的话是需要下载对应 electron 版本的支持文件。解决办法有两个

1. 设置镜像：在.npmrc 文件。然后加入下面这句代码

```text
electron_mirror=http://npm.taobao.org/mirrors/electron/
```

2. 直接去淘宝镜像文件库找到对应的文件并下载，放到指定的目录下，electron 的淘宝镜像地址。下载完之后放到指定的文件。

##### NSIS 下载问题

### 热重载(开发实时刷新)


### 热更新