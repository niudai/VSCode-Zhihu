"use strict";

import * as vscode from "vscode";

import { DepNodeProvider, Dependency } from "./zhihu";
import { JsonOutlineProvider } from "./jsonOutline";
import { FtpExplorer } from "./ftpExplorer";
import { FileExplorer } from "./fileExplorer";
import { TestView } from "./testView";
import * as httpClient from 'request';
import * as HtmlParser from 'node-html-parser';
import { imageUrlConverter } from './util/imageUrlConverter';
import { QuestionAnswers } from "./model/questions-answers.model";

export function activate(context: vscode.ExtensionContext) {
	const includeContent = 'data[*].is_normal,content;';
	let offset = 0;
	context.subscriptions.push(
		vscode.commands.registerCommand("zhihu.openWebView", (questionId: number) => {
			const panel = vscode.window.createWebviewPanel(
				"zhihu",
				"node denpendencies",
				vscode.ViewColumn.One,
				{}
			);
			let answerAPI = `https://www.zhihu.com/api/v4/questions/${questionId}/answers?include=${includeContent}?offset=${offset}`
			httpClient(answerAPI, { json: true }, (err, _res, body: QuestionAnswers ) => {
				console.log(answerAPI);
				// let answerHtmlRoots = body.data.map(answer => HtmlParser.parse(answer.content));
				// let imgAttrs = answerHtmlRoots.filter(root => root.querySelector('img')).map(root => root.querySelectorAll('img'));

				// // convert img src in answer inner html
				// imgAttrs.forEach(attr => {
				// 	attr.forEach(img => {
				// 		let src = imageUrlConverter(img.rawAttributes['data-actualsrc']);
				// 		img.rawAttributes.src = src;
				// 		img.rawAttributes.style = 'style = \"width: 90%\"';
				// 		img.rawAttrs = `src = \"${src}\" style = \"width: 90%\"`;
				// 		console.log(img.rawAttributes);
				// 		console.log(img.rawAttr);
				// 	}
				// 	);
				// });
				// // convert img src for avatar
				// body.data.forEach(answer => {
				// 	answer.author.avatar_url = imageUrlConverter(answer.author.avatar_url);
				// });
				// // convert 
				// body.data.forEach((answer, index) => answer.content = answerHtmlRoots[index].toString());
				panel.webview.html = body.data[0].content;
			});
		}
		));
	// Samples of `window.registerTreeDataProvider`
	const zhihuProvider = new DepNodeProvider(
		vscode.workspace.rootPath
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
