# electron-learn

官网：https://electronjs.org/

## 本次项目功能点

1. 登陆跳转
2. main process和web page 通信  https://www.electronjs.org/docs/api/ipc-main    
https://blog.csdn.net/weixin_42762089/article/details/87912222  
https://blog.csdn.net/weixin_42762089/article/details/88532572  
https://blog.csdn.net/weixin_34356555/article/details/92283856  
3. 列表
4. 聊天和输入界面可拖动切换大小
 
5. Main Process 模块
通知——收到消息，在窗口最小化的时候通知显示。

6. Renderer Process 模块  
desktopCapturer  
ipcRenderer  
remote  
webFrame  

7. 两种进程都可用的模块  
clipboard  
crashReporter  
nativeImage  
shell  

macos-dock： https://www.electronjs.org/docs/tutorial/macos-dock  
https://segmentfault.com/a/1190000020593227  
touch-bar： mac的touch-bar功能暂且不做 https://www.electronjs.org/docs/api/touch-bar

8. Electron无边框窗口（最小化、最大化、关闭、拖动）以及动态改变窗口大小  https://blog.csdn.net/fukaiit/article/details/91351448  

9. electron 优化 https://juejin.im/post/5e0010866fb9a015fd69c645  

10. electron截屏 https://juejin.im/post/5bcedc98f265da0abc2ba45d  **
electron的版本原因导致不能用，原3.0.2**

textarea改成div，可粘贴图片 https://blog.csdn.net/miss_liang/article/details/72864917  

11. vscode-electron-debug  

12. 功能：切下个会话，类似小红点  

13. 开机自启动 node-auto-launch  https://github.com/Teamwork/node-auto-launch 

14. 坑https://www.jianshu.com/p/9c8f7223ccbb  

15. Electron选择文件、文件夹对话框  https://www.jianshu.com/p/e71e16a374b1  

16. 集成c++ 
 https://www.jianshu.com/p/93ffa05f028f   
 https://blog.csdn.net/wang839305939/article/details/83780789    
 https://www.jianshu.com/p/5a4c7ce2be54  
 https://www.dazhuanlan.com/2019/09/23/5d88a0bc8ec13/  
 https://stackoverflow.com/questions/32986826/calling-node-native-addons-c-in-electron  

 17. 监听网络情况，显示网络待连接，或者图标上显示个x    
 https://www.electronjs.org/docs/tutorial/online-offline-events  
 https://cloud.tencent.com/developer/section/1115770  

 18. 发生图片的时候，fs在本地写选择的图片，然后本地路径，显示图片，upload文件夹吧  

 19. 奔溃报告上传  https://juejin.im/post/5c5ee47be51d457f95354c82  
 https://cloud.tencent.com/developer/section/1116135  
 https://www.electronjs.org/docs/api/crash-reporter  
 https://www.bookstack.cn/read/electron-v5/61.md  

 20. debugger https://cloud.tencent.com/developer/section/1116142  

## 1. 安装

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

## 2. electron 原理

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

### 2.2. 使用 Node.js 的 API

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

## 3. electron 常用 api

### 3.1. app

主进程

```js
const { app } = require('electron')
app.on('window-all-closed', () => {
  app.quit()
})
```

#### 3.1.1. 事件

https://electronjs.org/docs/api/app#%E4%BA%8B%E4%BB%B6







### 3.2. menu

#### accelerator 快捷键

https://electronjs.org/docs/api/accelerator

1. 快捷键可以包含多个功能键和一个键码的字符串，由符号+结合，用来定义你应用中的键盘快捷键


## 4. 渲染进程和主进程

Electron 运行 package.json 的 main 脚本的进程被称为主进程。 在主进程中运行的脚本通过创建 web 页面来展示用户界面。 一个 Electron 应用总是有且只有一个主进程。

由于 Electron 使用了 Chromium 来展示 web 页面，所以 Chromium 的多进程架构也被使用到。 每个 Electron 中的 web 页面运行在它自己的渲染进程中。

在普通的浏览器中，web 页面通常在沙盒环境中运行，并且无法访问操作系统的原生资源。 然而 Electron 的用户在 Node.js 的 API 支持下可以在页面中和操作系统进行一些底层交互。

### 4.1. 主进程和渲染进程之间的区别

主进程使用 BrowserWindow 实例创建页面。 每个 BrowserWindow 实例都在自己的渲染进程里运行页面。 当一个 BrowserWindow 实例被销毁后，相应的渲染进程也会被终止。

主进程管理所有的 web 页面和它们对应的渲染进程。 每个渲染进程都是独立的，它只关心它所运行的 web 页面。

在页面中调用与 GUI 相关的原生 API 是不被允许的，因为在 web 页面里操作原生的 GUI 资源是非常危险的，而且容易造成资源泄露。 如果你想在 web 页面里使用 GUI 操作，其对应的渲染进程必须与主进程进行通讯，请求主进程进行相关的 GUI 操作。

Electron 为主进程（ main process）和渲染器进程（renderer processes）通信提供了多种实现方式，如可以使用 ipcRenderer 和 ipcMain 模块发送消息，使用 remote 模块进行 RPC 方式通信


![渲染进程和主进程](images/ipcRenderer.png)

### 4.2. Electron 渲染进程

```js
// 引入模块，各进程直接在electron模块引入即可。例子:
const { app, BrowserWindow } = require(‘electron’) // 主进程引入app, BrowserWindow模块

const { ipcRenderer } = require(‘electron’) // 渲染进程引入ipcRenderer
ipcRenderer.invoke(channel, ...args).then(result => { handleResult }) // 渲染进程跟主进程发送请求
```

- 展示 Web 页面的进程称为渲染进程

- 通过 Node.js、Electron 提供的 API 可以跟系统底层打交道

- 一个 Electron 应用可以有多个渲染进程

### 4.3. Electron 主进程

ipcMain.handle(channel, handler)，处理理渲染进程的 channel 请求，在 handler 中 return 返回结果

- Electron 运行 package.json 的 main 脚本的进程被称为主进程

- 每个应用只有一个主进程

- 管理原生 GUI，典型的窗口(BrowserWindow、Tray、Dock、Menu)

- 创建渲染进程

- 控制应用生命周期(app)

![渲染进程和主进程](images/ipcRenderer2.png)

### 4.4. 进程间通信

1. IPC 模块通信  

- Electron 提供了 IPC 通信模块，主进程的 ipcMain 和 渲染进程的 ipcRenderer  
- ipcMain、ipcRenderer 都是 EventEmitter 对象  

2. 进程间通信:从渲染进程到主进程  

- Callback 写法:  
ipcRenderer.send  
ipcMain.on  

- Promise 写法 (Electron 7.0 之后，处理请求 + 响应模式)  
ipcRenderer.invoke   
ipcMain.handle  

3. 进程间通信:从主进程到渲染进程  

- 主进程通知渲染进程:  
ipcRenderer.on  
webContents.send  

4. 页面间(渲染进程与渲染进程间)通信  

- 通知事件  
  
通过主进程转发(Electron 5之前)  
ipcRenderer.sendTo (Electron 5之后) 数据共享  

- 数据共享  

Web 技术(localStorage、sessionStorage、indexedDB)  
使用 remote  

**注意**    

- 少用 remote 模块  
- 不要用 sync 模式  
- 在请求 + 响应的通信模式下，需要自定义超时限制  

## 5. Electron 应用原生能力

### 5.1. 使用 Electron API 创建原生 GUI

- BrowserWindow 
- Tray
- app
- Menu
- dialog 
- TouchBar

### 5.2. 使用 Electron API 获得底层能力

- clipboard 
- screen 
- globalShortcut 
- desktopCapture 
- shell 
- powerMonitor

### 5.3. 使用 Node.js 获得底层能力

- Electron 同时在主进程和渲染进程中对 Node.js 暴露了所有的接口

fs 进行文件读写
crypto 进行加解密

- 通过 npm 安装即可引入社区上所有的 Node.js 库

### 5.4. 使用 Node.js 调用原生模块

- node.js add-on 
- node-ffi

### 5.5. 调用 OS 能力

- WinRT 
- Applescript 
- Shell

![Electron 的能力](images/ability.png)



## 6. 打包

### 6.1. [electron-builder](https://github.com/electron-userland/electron-builder)

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

#### 常见错误

##### NPM 下载的问题

因为 NPM 在国内比较慢。导致 electron-V.xxxx.zip 下载失败。这些东西如果是第一次打包的话是需要下载对应 electron 版本的支持文件。解决办法有两个

1. 设置镜像：在.npmrc 文件。然后加入下面这句代码

```text
electron_mirror=http://npm.taobao.org/mirrors/electron/
```

2. 直接去淘宝镜像文件库找到对应的文件并下载，放到指定的目录下，electron 的淘宝镜像地址。下载完之后放到指定的文件。

##### NSIS 下载问题

### 热重载

https://codeday.me/bug/20190129/597088.html

### 热更新

## 7. 脚手架 electron-forge

https://juejin.im/post/5c46ab47e51d45522b4f55b1

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


## 9. 原生 GUI

### 关于窗口

1. 禁止多开  

```js
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) { app.quit()
} else {
app.on('second-instance', (event, commandLine, workingDirectory) => {
// 当运行第二个实例时,将会聚焦到myWindow这个窗口
showMainWindow() })
app.on('ready', () => {...
}) }
```

2. 窗口假关闭  

- 用户点击窗口关闭按钮时候，应用只是隐藏   
- 点击「退出应用」时才真正关闭窗口  

### 9.1. Menu/MenuItem(菜单/菜单项)

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

### 9.2. Tray(托盘)

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


## 9. 测试和调试


## Electron 开发过程中可能会遇到的几个问题和场景。

- 启动时间优化  
Electron 应用创建窗口之后，由于需要初始化窗口，加载 html，js 以及各种依赖，会出现一个短暂的白屏。除了传统的，比如说延迟 js 加载等 web 性能优化的方法，在 Electron 中还可以使用一种方式，就是在 close 窗口之前缓存 index 页面，下次再打开窗口的时候直接加载缓存好的页面，这样就会提前页面渲染的时间，缩短白屏时间。  

但是，优化之后也还是会有白屏出现，对于这段时间可以用一个比较 tricky 的方法，就是让窗口监听 ready-to-show 事件，等到页面完成首次绘制后，再显示窗口。这样，虽然延迟了窗口显示时间，总归不会有白屏出现了。  

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


## 10. Electron客户端的安全：从xss到rce



## Electron无边框窗口（最小化、最大化、关闭、拖动）以及动态改变窗口大小

### 方法1

1. 要创建无边框窗口，只需在BrowserWindow的options中将frame设置为 false.  


2. 可拖拽区  

应用程序需要在 CSS 中指定 -webkit-app-region: drag 来告诉 Electron 哪些区域是可拖拽的  
在可拖拽区域内部使用 -webkit-app-region: no-drag 则可以将其中部分区域排除  
拖动行为可能与选择文本冲突。 例如, 当您拖动标题栏时, 您可能会意外地选择标题栏上的文本。 为防止此操作, 您需要在可区域中禁用文本选择  

```css
.titlebar {
  -webkit-app-region: drag;
  -webkit-user-select: none;
}
```

在某些平台上，可拖拽区域不被视为窗口的实际内容，而是作为窗口边框处理，因此在右键单击时会弹出系统菜单。 要使上下文菜单在所有平台上都正确运行, 您永远也不要在可拖拽区域上使用自定义上下文菜单。  

#### 最小化、最大化、关闭

1. render 进程通过 ipcRenderer 与 ipcMain 进行通讯，以通知 main 进程操作窗体。  

2. 在renderer.js中添加click事件，发送操作命令给主进程

```js
let ipcRenderer = require('electron').ipcRenderer;

var max = document.getElementById('max');
if (max) {
    max.addEventListener('click', () => {
        //发送最大化命令
        ipcRenderer.send('window-max');
        //最大化图形切换
        if (max.getAttribute('src') == 'images/max.png') {
            max.setAttribute('src', 'images/maxed.png');
        } else {
            max.setAttribute('src', 'images/max.png');
        }
    })
}

var min = document.getElementById('min');
if (min) {
    min.addEventListener('click', () => {
        //发送最小化命令
        ipcRenderer.send('window-min');
    })
}

var close = document.getElementById('close');
if (close) {
    close.addEventListener('click', () => {
        //发送关闭命令
        ipcRenderer.send('window-close');
    })
}
```

3. 在main.js中接收操作命令，做出相应处理

```js
let ipcMain = require('electron').ipcMain;
//接收最小化命令
ipcMain.on('window-min', function() {
    mainWindow.minimize();
})
//接收最大化命令
ipcMain.on('window-max', function() {
    if (mainWindow.isMaximized()) {
        mainWindow.restore();
    } else {
        mainWindow.maximize();
    }
})
//接收关闭命令
ipcMain.on('window-close', function() {
    mainWindow.close();
})
```

这里最大化和取消最大化时，修改图标的方法不合适，因为通过双击drag-area或者拉动窗口到屏幕边缘等操作，也可能修改窗口的状态。
因此，应该在主进程中监听窗口的最大化操作，然后发送命令给渲染进程：

```js
mainWindow.on('maximize', function () {
 mainWindow.webContents.send('main-window-max');
})
mainWindow.on('unmaximize', function () {
  mainWindow.webContents.send('main-window-unmax');
})
```
在渲染进程中接收到相应命令，再进行处理：

```js
ipcRenderer.on('main-window-max', (event) => {
	max.classList.remove('icon-max');
	max.classList.add('icon-maxed');
});
ipcRenderer.on('main-window-unmax', (event) => {
	max.classList.remove('icon-maxed');
	max.classList.add('icon-max');
});
```

发送最大化给主进程

```js
var loginbtn = document.getElementById('login');
if (loginbtn) {
    loginbtn.addEventListener('click', () => {
        ipcRenderer.send('window-max');
        location.href = "index.html";
    })
}
```

### 方法2

结果在一个隐藏的标题栏中，另一种方式是交通灯按钮从窗口边缘稍微嵌入。

```js
const {BrowserWindow} = require('electron')
let win = new BrowserWindow({titleBarStyle: 'hiddenInset'})
win.show()
```

默认情况下, 无边框窗口是不可拖拽的。 应用程序需要在 CSS 中指定 -webkit-app-region: drag 来告诉 Electron 哪些区域是可拖拽的（如操作系统的标准标题栏），在可拖拽区域内部使用 -webkit-app-region: no-drag 则可以将其中部分区域排除。 请注意, 当前只支持矩形形状。  

注意: -webkit-app-region: drag 在开发人员工具打开时会出现问题。 查看更多信息 (包括变通方法), 请参见此 [GitHub 问题](https://github.com/electron/electron/issues/3647) 。  

要使整个窗口可拖拽, 您可以添加 -webkit-app-region: drag 作为 body 的样式:  

```html
<body style="-webkit-app-region: drag">
</body>
```