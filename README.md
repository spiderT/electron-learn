# electron-learn

官网：https://electronjs.org/

## 1. 安装

### nvm安装
```
Mac/Linux: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh | bash
Windows: https://github.com/coreybutler/nvm-windows/releasesa
验证nvm: nvm --versiona
```


### Node.js/NPM 安装
```
安装 Node.js: nvm install 12.14.0 
切换 Node.js 版本:nvm use 12.14.0
验证 npm -v
验证 node -v
```

### node安装加速机器
```
// mac 在 .bashrc 或者 .zshrc 加入
export NVM_NODEJS_ORG_MIRROR=http://npm.taobao.org/mirrors/node

// Windows 在 %userprofile%\AppData\Roaming\nvm\setting.txt 加入
node_mirror: https://npm.taobao.org/mirrors/node/ npm_mirror: https://npm.taobao.org/mirrors/npm/
```

### Electron 安装
```
npm install electron --save-dev
npm install --arch=ia32 --platform=win32 electron 

// 验证安装成功:
npx electron -v (npm > 5.2)
./node_modules/.bin/electron -v 
```

### Electron加速技巧
```
# 设置ELECTRON_MIRROR
ELECTRON_MIRROR=https://cdn.npm.taobao.org/dist/electron/ npm install electron --save- dev
```

## 2. electron原理

Node.js 和 Chromiums 整合
 - Chromium 集成到 Node.js: 用 libuv 实现 messagebump (nw)

- 难点:Node.js 事件循环基于 libuv，但 Chromium 基于 message bump

Node.js 集成到 Chromium

![chromium](images/chromium.png)
![electron](images/electron.png)


### 2.1. 主进程和渲染器进程

Electron 运行 package.json 的 main 脚本的进程被称为主进程。 在主进程中运行的脚本通过创建web页面来展示用户界面。 一个 Electron 应用总是有且只有一个主进程。

由于 Electron 使用了 Chromium 来展示 web 页面，所以 Chromium 的多进程架构也被使用到。 每个 Electron 中的 web 页面运行在它自己的渲染进程中。

在普通的浏览器中，web页面通常在沙盒环境中运行，并且无法访问操作系统的原生资源。 然而 Electron 的用户在 Node.js 的 API 支持下可以在页面中和操作系统进行一些底层交互。

#### 2.1.1. 主进程和渲染进程之间的区别
主进程使用 BrowserWindow 实例创建页面。 每个 BrowserWindow 实例都在自己的渲染进程里运行页面。 当一个 BrowserWindow 实例被销毁后，相应的渲染进程也会被终止。

主进程管理所有的web页面和它们对应的渲染进程。 每个渲染进程都是独立的，它只关心它所运行的 web 页面。

在页面中调用与 GUI 相关的原生 API 是不被允许的，因为在 web 页面里操作原生的 GUI 资源是非常危险的，而且容易造成资源泄露。 如果你想在 web 页面里使用 GUI 操作，其对应的渲染进程必须与主进程进行通讯，请求主进程进行相关的 GUI 操作。

Electron为主进程（ main process）和渲染器进程（renderer processes）通信提供了多种实现方式，如可以使用ipcRenderer 和 ipcMain模块发送消息，使用 remote模块进行RPC方式通信

#### 2.1.2. 使用Electron的API

Electron在主进程和渲染进程中提供了大量API去帮助开发桌面应用程序， 在主进程和渲染进程中，你可以通过require的方式将其包含在模块中以此，获取Electron的API

```js
const electron = require('electron')
```

所有Electron的API都被指派给一种进程类型。 许多API只能被用于主进程或渲染进程中，但其中一些API可以同时在上述两种进程中使用。 每一个API的文档都将声明你可以在哪种进程中使用该API。

Electron中的窗口是使用BrowserWindow类型创建的一个实例， 它只能在主进程中使用。

```js
// 这样写在主进程会有用，但是在渲染进程中会提示'未定义'
const { BrowserWindow } = require('electron')

const win = new BrowserWindow()
```
因为进程之间的通信是被允许的, 所以渲染进程可以调用主进程来执行任务。 Electron通过remote模块暴露一些通常只能在主进程中获取到的API。 为了在渲染进程中创建一个BrowserWindow的实例，我们通常使用remote模块为中间件：

```js
//这样写在渲染进程中时行得通的，但是在主进程中是'未定义'
const { remote } = require('electron')
const { BrowserWindow } = remote

const win = new BrowserWindow()
```


#### 2.1.3. 使用 Node.js 的 API

Electron同时对主进程和渲染进程暴露了Node.js 所有的接口。 这里有两个重要的定义：

1. 所有在Node.js可以使用的API，在Electron中同样可以使用。 在Electron中调用如下代码是有用的：

```js
const fs = require('fs')

const root = fs.readdirSync('/')

// 这会打印出磁盘根级别的所有文件
// 同时包含'/'和'C:\'。
console.log(root)
```

正如您可能已经猜到的那样，如果您尝试加载远程内容， 这会带来重要的安全隐患。 您可以在我们的 安全文档 中找到更多有关加载远程内容的信息和指南。

2)你可以在你的应用程序中使用Node.js的模块。 选择您最喜欢的 npm 模块。 npm 提供了目前世界上最大的开源代码库，那里包含良好的维护、经过测试的代码，提供给服务器应用程序的特色功能也提供给Electron。

例如，在你的应用程序中要使用官方的AWS SDK，你需要首先安装它的依赖：

npm install --save aws-sdk
然后在你的Electron应用中，通过require引入并使用该模块，就像构建Node.js应用程序那样：

```js
// 准备好被使用的S3 client模块
const S3 = require('aws-sdk/clients/s3')
```

有一个非常重要的提示: 原生Node.js模块 (即指，需要编译源码过后才能被使用的模块) 需要在编译后才能和Electron一起使用。

绝大多数的Node.js模块都不是原生的， 在650000个模块中只有400是原生的。


## 3. electron常用api


### 3.1. app

### 3.2. menu

#### accelerator 快捷键

https://electronjs.org/docs/api/accelerator

1. 快捷键可以包含多个功能键和一个键码的字符串，由符号+结合，用来定义你应用中的键盘快捷键




## 4. 测试和调试



## 5. 打包

### 5.1. ![electron-builder](https://github.com/electron-userland/electron-builder)

1. 在package.json应用程序中指定的标准字段 — name, description, version and author.

2. 在package.json 添加build配置:

```json
"build": {
  "appId": "your.id",
  "mac": {
    "category": "your.app.category.type"
  }
}
```
See all options. Option files to indicate which files should be packed in the final application, including the entry file, maybe required.

3. 添加icons.

制作icns图标

- brew install makeicns

- makeicns -in input.jpg -output out.icns

4. 在 package.json添加scripts命令:

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

##### NPM下载的问题

因为NPM在国内比较慢。导致electron-V.xxxx.zip下载失败。这些东西如果是第一次打包的话是需要下载对应electron版本的支持文件。解决办法有两个

1. 设置镜像：在.npmrc文件。然后加入下面这句代码

```text
electron_mirror=http://npm.taobao.org/mirrors/electron/
```

2. 直接去淘宝镜像文件库找到对应的文件并下载，放到指定的目录下，electron的淘宝镜像地址。下载完之后放到指定的文件。

##### NSIS下载问题



###  热重载

https://codeday.me/bug/20190129/597088.html


### 热更新

## 6. 脚手架 electron-forge 

https://juejin.im/post/5c46ab47e51d45522b4f55b1



