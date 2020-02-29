"use strict";

import * as fs from "fs";
import * as markdown_it_zhihu from "markdown-it-zhihu";
import * as path from "path";
import { CookieJar } from "tough-cookie";
import * as FileCookieStore from "tough-cookie-filestore";
import * as vscode from "vscode";
import { AccountService } from "./service/account.service";
import { AuthenticateService } from "./service/authenticate.service";
import { CollectionService } from "./service/collection.service";
import { EventService } from "./service/event.service";
import { HttpService } from "./service/http.service";
import { PasteService } from "./service/paste.service";
import { ProfileService } from "./service/profile.service";
import { PublishService } from "./service/publish.service";
import { ReleaseNotesService } from "./service/release-note.service";
import { SearchService } from "./service/search.service";
import { WebviewService } from "./service/webview.service";
import { CollectionItem, CollectionTreeviewProvider } from "./treeview/collection-treeview-provider";
import { EventTreeItem, FeedTreeItem, FeedTreeViewProvider } from "./treeview/feed-treeview-provider";
import { HotStoryTreeViewProvider } from "./treeview/hotstory-treeview-provider";
import MarkdownIt = require("markdown-it");

export async function activate(context: vscode.ExtensionContext) {
	if(!fs.existsSync(path.join(context.extensionPath, './cookie.json'))) {
		fs.createWriteStream(path.join(context.extensionPath, './cookie.json')).end()
	}
	vscode.window.showInformationMessage('插件激活');
	// Dependency Injection
	const releaseNotesService = new ReleaseNotesService(context);
	const store = new FileCookieStore(path.join(context.extensionPath, './cookie.json'));
	const zhihuMdParser = new MarkdownIt().use(markdown_it_zhihu);
	const defualtMdParser = new MarkdownIt();
	const cookieJar = new CookieJar(store);
	const httpService = new HttpService(context, cookieJar, store);
	const accountService = new AccountService(context, httpService);
	const profileService = new ProfileService(context, httpService, accountService);
	await profileService.fetchProfile();
	const collectionService = new CollectionService(context, httpService);
	const hotStoryTreeViewProvider = new HotStoryTreeViewProvider();
	const collectionTreeViewProvider = new CollectionTreeviewProvider(context, profileService, collectionService)
	const webviewService = new WebviewService(context, httpService, collectionService, collectionTreeViewProvider);
	const eventService = new EventService(context);
	const feedTreeViewProvider = new FeedTreeViewProvider(context, accountService, profileService, httpService, eventService);
	const publishService = new PublishService(context, httpService, zhihuMdParser, defualtMdParser, webviewService, collectionService, eventService, profileService);
	const searchService = new SearchService(context, webviewService);
	const authenticateService = new AuthenticateService(context, profileService, accountService, feedTreeViewProvider, httpService, webviewService);
	const pasteService = new PasteService(context, httpService);

	context.subscriptions.push(
		vscode.commands.registerCommand("zhihu.openWebView", async (object) => {
			await webviewService.openWebview(object);
		}
		));
	vscode.commands.registerCommand("zhihu.search", async () => 
		await searchService.getSearchItems()
	);
	vscode.commands.registerCommand("zhihu.login", () => 
		authenticateService.login()
	);
	vscode.commands.registerCommand("zhihu.logout", () => 
		authenticateService.logout()
	);
	vscode.window.registerTreeDataProvider(
		"zhihu-feed",
		feedTreeViewProvider
	);
	vscode.window.registerTreeDataProvider(
		"zhihu-hotStories",
		hotStoryTreeViewProvider
	);
	vscode.window.registerTreeDataProvider(
		"zhihu-collection",
		collectionTreeViewProvider
	)
	vscode.commands.registerTextEditorCommand('zhihu.publish', (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) => {
		publishService.publish(textEditor, edit);
	})
	vscode.commands.registerTextEditorCommand('zhihu.preview', (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) => {
		vscode.commands.executeCommand('markdown.showPreviewToSide');
	})
	vscode.commands.registerCommand('zhihu.uploadImageFromClipboard', async () => {
		pasteService.uploadImageFromClipboard()
	})

	vscode.commands.registerCommand('zhihu.uploadImageFromPath', (uri: vscode.Uri) => {
		pasteService.uploadImageFromPath(uri)
	})

	vscode.commands.registerCommand('zhihu.uploadImageFromExplorer', () => {
		pasteService.uploadImageFromExplorer()
	})
	vscode.commands.registerCommand("zhihu.refreshFeed", () => {
		feedTreeViewProvider.refresh();
	}
	);
	vscode.commands.registerCommand("zhihu.refreshHotstories", () => {
		hotStoryTreeViewProvider.refresh();
	})
	vscode.commands.registerCommand("zhihu.refreshCollection", () => {
		collectionTreeViewProvider.refresh();
	})
	vscode.commands.registerCommand("zhihu.addEntry", () =>
		vscode.window.showInformationMessage(`Successfully called add entry.`)
	);
	vscode.commands.registerCommand(
		"zhihu.editEntry",
		(node: FeedTreeItem) =>
			vscode.window.showInformationMessage(
				`Successfully called edit entry on ${node.label}.`
			)
	);
	vscode.commands.registerCommand(
		"zhihu.deleteCollectionItem",
		(node: CollectionItem) => {
			collectionService.deleteCollectionItem(node.item);
			collectionTreeViewProvider.refresh(node.parent);
			vscode.window.showInformationMessage('已从收藏夹移除');
		}
	)
	vscode.commands.registerCommand(
		"zhihu.deleteEventItem",
		(node: EventTreeItem) => {
			eventService.destroyEvent(node.event.hash);
			vscode.window.showInformationMessage(`已取消发布！`);
			feedTreeViewProvider.refresh(node.parent);
		}
	)
	vscode.commands.registerCommand(
		"zhihu.nextPage",
		(node: FeedTreeItem) => {
			node.page++;
			feedTreeViewProvider.refresh(node);
		}
	)
	vscode.commands.registerCommand(
		"zhihu.previousPage",
		(node: FeedTreeItem) => {
			node.page--;
			feedTreeViewProvider.refresh(node);
		}
	)


	return {
        extendMarkdownIt(md: any) {
            return md.use(require('markdown-it-katex'));
        }
    }
}