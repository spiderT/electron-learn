const minidump = require('minidump');
const fs = require('fs');

// symbolpath
minidump.addSymbolPath('/Users/tangting/tt/soft/electron-v9/breakpad_symbols/');

minidump.walkStack('./crash/c643b202bb5f8203b23d34037cc8690e',(err, res)=>{
    fs.writeFileSync('./error/error.txt', res);
})