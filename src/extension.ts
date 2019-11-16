"use strict";

import * as vscode from "vscode";

import { DepNodeProvider, Dependency } from "./zhihu";
import { JsonOutlineProvider } from "./jsonOutline";
import { FtpExplorer } from "./ftpExplorer";
import { FileExplorer } from "./fileExplorer";
import { TestView } from "./testView";
import * as httpClient from 'request';
import { QuestionAnswers } from "./model/questions-answers.model";
import * as pug from 'pug';
import * as path from 'path';
import { searchHandler } from './command/searchHandler';
import { openQuestionHandler } from "./command/openQuestionHandler";

export function activate(context: vscode.ExtensionContext) {
	const includeContent = 'data[*].is_normal,content;';
	let offset = 0;
	context.subscriptions.push(
		vscode.commands.registerCommand("zhihu.openWebView", async (questionId: number) => {
			await openQuestionHandler(questionId, context);
		}
		));
	// Samples of `window.registerTreeDataProvider`
	const zhihuProvider = new DepNodeProvider(
	);
	vscode.commands.registerCommand("zhihu.search", async () => 
		await searchHandler()
	);
	vscode.window.registerTreeDataProvider(
		"zhihu",
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
		(node: Dependency) =>
			vscode.window.showInformationMessage(
				`Successfully called edit entry on ${node.label}.`
			)
	);
	vscode.commands.registerCommand(
		"zhihu.deleteEntry",
		(node: Dependency) =>
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
	new TestView(context);
}
