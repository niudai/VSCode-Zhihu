"use strict";

import * as vscode from "vscode";

import { DepNodeProvider, Dependency } from "./nodeDependencies";
import { JsonOutlineProvider } from "./jsonOutline";
import { FtpExplorer } from "./ftpExplorer";
import { FileExplorer } from "./fileExplorer";
import { TestView } from "./testView";
import * as httpClient from 'request';
import * as HtmlParser from 'node-html-parser';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand("nodeDependencies.openWebView", (questionId: number) => {
			const panel = vscode.window.createWebviewPanel(
				"nodeDependencies",
				"node denpendencies",
				vscode.ViewColumn.One,
				{}
			);
			let answerAPI = `https://www.zhihu.com/api/v4/questions/${questionId}/answers?include=${includeContent}?offset=${offset}`
			httpClient(answerAPI, { json: true }, (err, _res, body) => {
				console.log(answerAPI);
				let answerHtmlRoots = body.data.map(answer => HtmlParser.parse(answer.content));
				let imgAttrs = answerHtmlRoots.filter(root => root.querySelector('img')).map(root => root.querySelectorAll('img'));

				// convert img src in answer inner html
				imgAttrs.forEach(attr => {
					attr.forEach(img => {
						let src = imageUrlConverter(img.rawAttributes['data-actualsrc']);
						img.rawAttributes.src = src;
						img.rawAttributes.style = 'style = \"width: 90%\"';
						img.rawAttrs = `src = \"${src}\" style = \"width: 90%\"`;
						console.log(img.rawAttributes);
						console.log(img.rawAttr);
					}
					);
				});
				// convert img src for avatar
				body.data.forEach(answer => {
					answer.author.avatar_url = imageUrlConverter(answer.author.avatar_url);
				});
				// convert 
				body.data.forEach((answer, index) => answer.content = answerHtmlRoots[index].toString());
				res.send(body);
				panel.webview.html = innerHtml;
			});
		}
		));
	// Samples of `window.registerTreeDataProvider`
	const nodeDependenciesProvider = new DepNodeProvider(
		vscode.workspace.rootPath
	);
	vscode.window.registerTreeDataProvider(
		"nodeDependencies",
		nodeDependenciesProvider
	);
	vscode.commands.registerCommand("nodeDependencies.refreshEntry", () =>
		nodeDependenciesProvider.refresh()
	);
	vscode.commands.registerCommand("extension.openPackageOnNpm", moduleName =>
		vscode.commands.executeCommand(
			"vscode.open",
			vscode.Uri.parse(`https://www.npmjs.com/package/${moduleName}`)
		)
	);
	vscode.commands.registerCommand("nodeDependencies.addEntry", () =>
		vscode.window.showInformationMessage(`Successfully called add entry.`)
	);
	vscode.commands.registerCommand(
		"nodeDependencies.editEntry",
		(node: Dependency) =>
			vscode.window.showInformationMessage(
				`Successfully called edit entry on ${node.label}.`
			)
	);
	vscode.commands.registerCommand(
		"nodeDependencies.deleteEntry",
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
