# 功能点

1. 包含菜单栏控制——播放上一首，下一首  
2. main process和web page 通信  https://www.electronjs.org/docs/api/ipc-main    
https://blog.csdn.net/weixin_42762089/article/details/87912222  
https://blog.csdn.net/weixin_42762089/article/details/88532572  
https://blog.csdn.net/weixin_34356555/article/details/92283856  
3. 关闭按钮——托盘隐藏  
4. 在已打开应用的时候，点击时，应用获得焦点  
 
5. Main Process 模块
通知

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