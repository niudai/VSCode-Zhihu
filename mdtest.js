const mdparser = require('markdown-it')();

let string = `
![img](https://cn.bing.com/th?id=OIP.Nxcyq-Brh3fKtW5lLOK0XgHaFS&pid=Api&rs=1)
`

console.log(mdparser.render(string))