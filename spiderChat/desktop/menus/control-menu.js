const submenu = [{
    label: '播放',
    accelerator: 'space',
  },
  {
    type: 'separator'
  },
  {
    label: '上一首',
    accelerator: 'CommandOrControl+Left',
  },
  {
    type: 'separator'
  },
  {
    label: '下一首',
    accelerator: 'CommandOrControl+Right',
  }
]

const controlMenu = {
  label: '&控制',
  submenu,
};

module.exports = controlMenu;
