import * as vscode from "vscode";
import * as httpClient from "request";
import * as pug from "pug";
import * as path from "path";
import { IQuestionAnswerTarget } from "../model/target/target";

export async function openWebviewHandler(
	object: { content?: string; type?: string; id?: number },
	context: vscode.ExtensionContext
): Promise<void> {
	if (object.type == 'question') {
		const includeContent = "data[*].is_normal,content;";
		let offset = 0;

		const panel = vscode.window.createWebviewPanel(
			"zhihu",
			"知乎问题",
			vscode.ViewColumn.One,
			{}
		);
		let answerAPI = `https://www.zhihu.com/api/v4/questions/${object.id}/answers?include=${includeContent}?offset=${offset}`;
		httpClient(
			answerAPI,
			{ json: true },
			(err, _res, body: { data: IQuestionAnswerTarget }) => {
				console.log(answerAPI);
				const compiledFunction = pug.compileFile(
					path.join(
						context.extensionPath,
						"src",
						"template",
						"questions-answers.pug"
					)
				);
				console.log(body.data);
				panel.iconPath = vscode.Uri.file(path.join(context.extensionPath, 'media', 'zhihu-logo-material.svg'));
				panel.webview.html = compiledFunction({
					answers: body.data,
					title: body.data[0].question.title
					// title: body.data[0].question.title
				});
			}
		);
	} else if (object.type == 'answer') {

		const panel = vscode.window.createWebviewPanel(
			"zhihu",
			"知乎回答",
			vscode.ViewColumn.One,
			{}
		);
		const compiledFunction = pug.compileFile(
			path.join(
				context.extensionPath,
				"src",
				"template",
				"questions-answers.pug"
			)
		);
		panel.iconPath = vscode.Uri.file(path.join(context.extensionPath, 'media', 'zhihu-logo-material.svg'));
		panel.webview.html = compiledFunction({
			answers: [object]
		});
	}
}
