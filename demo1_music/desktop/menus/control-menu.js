
const {send} = require('../windows');


function click(num) {
  send('change-music', num)
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
    accelerator: 'CommandOrControl+Left',
    click: click(2)
  },
  {
    type: 'separator'
  },
  {
    label: '下一首',
    accelerator: 'CommandOrControl+Right',
    click: click(3)
  }
]

const controlMenu = {
  label: '&控制',
  submenu,
};

module.exports = controlMenu;
