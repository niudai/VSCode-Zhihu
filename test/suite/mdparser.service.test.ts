import MarkdownIt = require("markdown-it");
import * as assert from 'assert';
import * as markdown_it_zhihu from "markdown-it-zhihu";
// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';

const testMdFile = `
# 图片都来自外域

![Image](https://tourscanner.co/blog/wp-content/uploads/2019/05/Tanah-Lot-Temple-1.png?x47719)

\`\`\`java

public class Apple {
    hello();
}
\`\`\`

$$
    \\sqrt5\\sqrt6
$$ 

行内 Latex：$\\sqrt5$
`


import md5 = require('md5');

// import * as myExtension from '../../extension';

suite('Markdown Parser Test', async () => {
	vscode.window.showInformationMessage('Start all tests.');
    const zhihuMdParser = new MarkdownIt({ html: true }).use(markdown_it_zhihu);

	// Dependency Injection

	test('parse test', () => {
        let resultHtml =  zhihuMdParser.parse(testMdFile, {});
		assert.equal(resultHtml, 'hello');
	});

});