import * as assert from 'assert';
import * as path from 'path';
import { CookieJar } from 'tough-cookie';
import * as FileCookieStore from "tough-cookie-filestore";
// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as markdown_it_zhihu from "markdown-it-zhihu";
import * as fs from 'fs';
import { HttpService } from '../../service/http.service';
import { ReleaseNotesService } from '../../service/release-note.service';
import MarkdownIt = require('markdown-it');
import { AccountService } from '../../service/account.service';
import { ProfileService } from '../../service/profile.service';
import { CollectionService } from '../../service/collection.service';
import { HotStoryTreeViewProvider } from '../../treeview/hotstory-treeview-provider';
import { CollectionTreeviewProvider } from '../../treeview/collection-treeview-provider';
import { WebviewService } from '../../service/webview.service';
import { EventService } from '../../service/event.service';
import { FeedTreeViewProvider } from '../../treeview/feed-treeview-provider';
import { SearchService } from '../../service/search.service';
import { AuthenticateService } from '../../service/authenticate.service';
import { PasteService } from '../../service/paste.service';
import { PipeService } from '../../service/pipe.service';
import { PublishService } from '../../service/publish.service';
import md5 = require('md5');

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
	const releaseNotesService = new ReleaseNotesService(context);
	const store = new FileCookieStore(path.join(context.extensionPath, './cookie.json'));
	const zhihuMdParser = new MarkdownIt({ html: true }).use(markdown_it_zhihu);
	const defualtMdParser = new MarkdownIt();
	const cookieJar = new CookieJar(store);


	test('Sample test', () => {
		assert.equal([1, 2, 3].indexOf(5), -1);
		assert.equal([1, 2, 3].indexOf(0), -1);
	});
});
