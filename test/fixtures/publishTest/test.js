const MarkdownIt = require('markdown-it');
const markdown_it_zhihu = require('markdown-it-zhihu');
const fs = require('fs');
const path = require('path');

const zhihuMdParser = new MarkdownIt({ html: true }).use(markdown_it_zhihu);

let MdStr = fs.readFileSync(path.join(__dirname, 'test.md'), 'utf8');

console.log(zhihuMdParser.render(MdStr));

fs.writeFileSync(path.join(__dirname, 'test_assert.html'), zhihuMdParser.render(MdStr))