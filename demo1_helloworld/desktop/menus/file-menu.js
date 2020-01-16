function click(num) {
  console.log(num)
}

const submenu = [{
    label: '播放',
    accelerator: 'space',
    click: click(1)
  },
  {
    type: 'separator'
  },
  {
    label: '上一首',
    accelerator: 'CommandOrControl+N',
    click: click(2)
  }
]

const fileMenu = {
  label: '&File',
  submenu,
};

module.exports = fileMenu;
