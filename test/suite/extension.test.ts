import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import md5 = require('md5');
import MarkdownIt = require('markdown-it');

// import * as myExtension from '../../extension';

suite('Extension Test Suite', async () => {
	vscode.window.showInformationMessage('Start all tests.');

	// beans mock initialization
	let context: vscode.ExtensionContext = {
		extensionPath: path.join(__dirname, '../../../'),
		globalState: {
			get() {},
			update(key: string, v: string): Promise<void> { return Promise.resolve()}
		},
		logPath: '',
		storagePath: '',
		asAbsolutePath(str) { return ''},
		globalStoragePath: '',
		subscriptions: [{dispose() {}} ],
		workspaceState: undefined
	};
	if(!fs.existsSync(path.join(context.extensionPath, './cookie.json'))) {
		fs.createWriteStream(path.join(context.extensionPath, './cookie.json')).end()
	}
	// Dependency Injection

	test('Sample test', () => {
		assert.equal([1, 2, 3].indexOf(5), -1);
		assert.equal([1, 2, 3].indexOf(0), -1);
	});
});
