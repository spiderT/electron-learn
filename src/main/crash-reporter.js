const { crashReporter } = require('electron');

function init() {
  crashReporter.start({
    productName: 'spiderchat',
    companyName: 'spiderT',
    submitURL: 'http://127.0.0.1:9999/crash',
  });
}
module.exports = {
  init,
};
