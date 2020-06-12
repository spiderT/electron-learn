const minidump = require('minidump');
const fs = require('fs');

// symbolpath
minidump.addSymbolPath('/Users/tangting/tt/soft/electron-v9/breakpad_symbols/');

minidump.walkStack('./crash/aebd0e03e9f27f8e9d111f3aa8b67409',(err, res)=>{
    fs.writeFileSync('./error.txt', res);
})