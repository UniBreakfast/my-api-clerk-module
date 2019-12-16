c = console.log


const fs = require('fs').promises
fs.readdir('.').then(c)


setTimeout(c, 1e7)
