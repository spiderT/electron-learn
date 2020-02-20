const openAboutWindow = require('about-window').default;
const path = require('path');

const aboutWindow = () => openAboutWindow({
  icon_path: path.join(__dirname, '../../resources/images/zhizhuxia_2_big.png'), 
  package_json_dir: path.resolve(__dirname + '../../../'),
  copyright: 'Copyright (c) 2020 TT',
})

module.exports = aboutWindow;