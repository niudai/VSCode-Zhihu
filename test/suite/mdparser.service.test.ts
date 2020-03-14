import MarkdownIt = require("markdown-it");
import * as assert from 'assert';
import * as markdown_it_zhihu from "markdown-it-zhihu";
// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';

const testMdFile = `
\`\`\`java

public class Apple {
    hello();
}
\`\`\`
`

const testHtml = `<pre lang="java">
public class Apple {
    hello();
}
</pre>`



import md5 = require('md5');
import { readFile, readFileSync } from "fs";
import { fixturePath } from "./global.test";
import { join } from "path";

const samplesPath = join(fixturePath, 'publishTest');
// import * as myExtension from '../../extension';

suite('Markdown Parser Test', async () => {
	vscode.window.showInformationMessage('Start all tests.');
    const zhihuMdParser = new MarkdownIt({ html: true }).use(markdown_it_zhihu);
	// Dependency Injection

	test('parse test', () => {
        let testMd = readFileSync(join(samplesPath, 'test.md'), 'utf8');
        let assertHtml = readFileSync(join(samplesPath, 'test_assert.html'), 'utf8');
		assert.equal(zhihuMdParser.render(testMd, {}), assertHtml);
	});

});