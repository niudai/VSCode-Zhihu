"use strict";

import * as fs from "fs";
import * as path from "path";
import { CookieJar } from "tough-cookie";
import * as FileCookieStore from "tough-cookie-filestore";
import * as vscode from "vscode";
import { AccountService } from "./service/account.service";
import { AuthenticateService } from "./service/authenticate.service";
import { CollectionService } from "./service/collection.service";
import { HttpService } from "./service/http.service";
import { ProfileService } from "./service/profile.service";
import { PublishService } from "./service/publish.service";
import { SearchService } from "./service/search.service";
import { WebviewService } from "./service/webview.service";
import { FeedTreeViewProvider, FeedTreeItem } from "./treeview/feed-treeview-provider";
import { HotStoryTreeViewProvider } from "./treeview/hotstory-treeview-provider";
import MarkdownIt = require("markdown-it");
import { CollectionTreeviewProvider, CollectionItem } from "./treeview/collection-treeview-provider";

export async function activate(context: vscode.ExtensionContext) {
	if(!fs.existsSync(path.join(context.extensionPath, './cookie.json'))) {
		fs.createWriteStream(path.join(context.extensionPath, './cookie.json')).end()
	}

	// Dependency Injection
	const store = new FileCookieStore(path.join(context.extensionPath, './cookie.json'));
	const mdParser = new MarkdownIt();
	const cookieJar = new CookieJar(store);
	const httpService = new HttpService(context, cookieJar, store);
	const profileService = new ProfileService(context, httpService);
	await profileService.fetchProfile();
	const accountService = new AccountService(context, httpService);
	const collectionService = new CollectionService(context, httpService);
	const feedTreeViewProvider = new FeedTreeViewProvider(context, accountService, profileService, httpService);
	const hotStoryTreeViewProvider = new HotStoryTreeViewProvider();
	const collectionTreeViewProvider = new CollectionTreeviewProvider(context, profileService, collectionService)
	const webviewService = new WebviewService(context, httpService, collectionService, collectionTreeViewProvider);
	const publishService = new PublishService(context, httpService, mdParser, webviewService);
	const searchService = new SearchService(context, webviewService);
	const authenticateService = new AuthenticateService(context, profileService, accountService, feedTreeViewProvider, httpService, webviewService);

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
		publishService.preview(textEditor, edit);
	})
	vscode.commands.registerCommand("zhihu.refreshEntry", () => {
		feedTreeViewProvider.refresh();
		hotStoryTreeViewProvider.refresh();
		collectionTreeViewProvider.refresh();
	}
	);
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
		"zhihu.deleteItem",
		(node: CollectionItem) => {
			collectionService.deleteItem(node.item);
			collectionTreeViewProvider.refresh(node.parent);
			vscode.window.showInformationMessage('已从收藏夹移除');
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
	vscode.commands.registerCommand(
		"zhihu.deleteEntry",
		(node: FeedTreeItem) =>
			vscode.window.showInformationMessage(
				`Successfully called delete entry on ${node.label}.`
			)
	);
}