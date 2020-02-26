const submenu = [{
    label: '发起会话...',
    accelerator: 'CommandOrControl+N',
  },
  {
    label: '置顶/取消置顶',
    accelerator: 'up+CommandOrControl+T',
  },
  {
    label: '静音/取消静音',
    accelerator: 'up+CommandOrControl+M',
  },
  {
    type: 'separator'
  },
  {
    label: '备份与恢复',
  },
  {
    label: '关闭',
    accelerator: 'CommandOrControl+W',
  },
]

const fileMenu = {
  label: '&文件',
  submenu,
};

module.exports = fileMenu;
