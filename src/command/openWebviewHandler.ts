import * as vscode from "vscode";
import * as httpClient from "request";
import { QuestionAnswers } from "../model/questions-answers.model";
import * as pug from "pug";
import * as path from "path";

export async function openWebviewHandler(
	object: { content?: string; type?: string; id?: number },
	context: vscode.ExtensionContext
): Promise<void> {
	if (object.type == 'question') {
		const includeContent = "data[*].is_normal,content;";
		let offset = 0;

		const panel = vscode.window.createWebviewPanel(
			"zhihu",
			"zhihu-answer",
			vscode.ViewColumn.One,
			{}
		);
		let answerAPI = `https://www.zhihu.com/api/v4/questions/${object.id}/answers?include=${includeContent}?offset=${offset}`;
		httpClient(
			answerAPI,
			{ json: true },
			(err, _res, body: QuestionAnswers) => {
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
				panel.webview.html = compiledFunction({
					answers: body.data
					// title: body.data[0].question.title
				});
			}
		);
	} else if (object.type == 'answer') {

		const panel = vscode.window.createWebviewPanel(
			"zhihu",
			"zhihu-answer",
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
		panel.webview.html = compiledFunction({
			answers: [object]
			// title: body.data[0].question.title
		});
	}
}
