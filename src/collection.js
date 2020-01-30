const fs = require("fs");

let object = {
	a: 4,
	b: 'Hello Wolrd',
	c: []
}

console.log(JSON.stringify(object))

fs.writeFileSync('collection.json', JSON.stringify(object))

let _object = JSON.parse(fs.readFileSync('collection.json', 'utf8'))

console.log(_object)