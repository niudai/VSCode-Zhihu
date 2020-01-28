const fs = require('fs');

fs.writeFileSync('./helloworld', 'abdf', 'base64');

console.log(fs.readFileSync('./helloworld'))
