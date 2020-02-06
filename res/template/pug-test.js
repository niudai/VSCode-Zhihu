const pug = require('pug');
const fs = require('fs');
const path = require('path');

console.log(__dirname)
const compiledFunction = pug.compileFile(
	path.join(__dirname, 'article.pug')
);
fs.writeFileSync(path.join(__dirname, 'article.html'), compiledFunction());