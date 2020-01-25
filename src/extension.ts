"use strict";

import * as vscode from "vscode";

import { ZhihuTreeViewProvider, ZhihuTreeItem } from "./ZhihuTreeViewProvider";
import { JsonOutlineProvider } from "./jsonOutline";
import { FtpExplorer } from "./ftpExplorer";
import { FileExplorer } from "./fileExplorer";
import { searchHandler } from './command/searchHandler';
import { openWebviewHandler } from "./command/openWebviewHandler";
import { loginHandler } from "./command/loginHandler";
import { ProfileService } from "./service/profile.service";
import { logoutHandler } from "./command/logoutHandler";
import { AccountService } from "./service/account.service";
import { WebviewService } from "./service/webview.service";

export async function activate(context: vscode.ExtensionContext) {


	// Bean Initialization
	const profileService = new ProfileService(context);
	await profileService.fetchProfile();
	const accountService = new AccountService(context);
	const webviewService = new WebviewService(context);

	const zhihuProvider = new ZhihuTreeViewProvider(context, accountService, profileService);

	context.subscriptions.push(
		vscode.commands.registerCommand("zhihu.openWebView", async (object) => {
			await openWebviewHandler(object, context, webviewService);
		}
		));
	vscode.commands.registerCommand("zhihu.search", async () => 
		await searchHandler(context, webviewService)
	);
	vscode.commands.registerCommand("zhihu.login", () => 
		loginHandler(context, profileService, accountService)
	);
	vscode.commands.registerCommand("zhihu.logout", () => 
		logoutHandler(context)
	);
	vscode.window.registerTreeDataProvider(
		"zhihu-feed",
		zhihuProvider
	);
	vscode.window.registerTreeDataProvider(
		"zhihu-hotStories",
		zhihuProvider
	);
	vscode.commands.registerCommand("zhihu.refreshEntry", () =>
		zhihuProvider.refresh()
	);
	vscode.commands.registerCommand("extension.openPackageOnNpm", moduleName =>
		vscode.commands.executeCommand(
			"vscode.open",
			vscode.Uri.parse(`https://www.npmjs.com/package/${moduleName}`)
		)
	);
	vscode.commands.registerCommand("zhihu.addEntry", () =>
		vscode.window.showInformationMessage(`Successfully called add entry.`)
	);
	vscode.commands.registerCommand(
		"zhihu.editEntry",
		(node: ZhihuTreeItem) =>
			vscode.window.showInformationMessage(
				`Successfully called edit entry on ${node.label}.`
			)
	);
	vscode.commands.registerCommand(
		"zhihu.nextPage",
		(node: ZhihuTreeItem) => {
			node.page++;
			zhihuProvider.refresh(node);
		}
	)
	vscode.commands.registerCommand(
		"zhihu.previousPage",
		(node: ZhihuTreeItem) => {
			node.page--;
			zhihuProvider.refresh(node);
		}
	)
	vscode.commands.registerCommand(
		"zhihu.deleteEntry",
		(node: ZhihuTreeItem) =>
			vscode.window.showInformationMessage(
				`Successfully called delete entry on ${node.label}.`
			)
	);

	const jsonOutlineProvider = new JsonOutlineProvider(context);
	vscode.window.registerTreeDataProvider("jsonOutline", jsonOutlineProvider);
	vscode.commands.registerCommand("jsonOutline.refresh", () =>
		jsonOutlineProvider.refresh()
	);
	vscode.commands.registerCommand("jsonOutline.refreshNode", offset =>
		jsonOutlineProvider.refresh(offset)
	);
	vscode.commands.registerCommand("jsonOutline.renameNode", offset =>
		jsonOutlineProvider.rename(offset)
	);
	vscode.commands.registerCommand("extension.openJsonSelection", range =>
		jsonOutlineProvider.select(range)
	);

	// Samples of `window.createView`
	new FtpExplorer(context);
	new FileExplorer(context);

	// Test View
}