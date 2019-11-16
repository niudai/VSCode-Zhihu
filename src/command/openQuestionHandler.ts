import * as vscode from "vscode";
import * as httpClient from "request";
import { QuestionAnswers } from "../model/questions-answers.model";
import * as pug from "pug";
import * as path from "path";

export async function openWebviewHandler(
	questionId: number,
	context: vscode.ExtensionContext
): Promise<void> {
	const includeContent = "data[*].is_normal,content;";
	let offset = 0;

	const panel = vscode.window.createWebviewPanel(
		"zhihu",
		"zhihu-answer",
		vscode.ViewColumn.One,
		{}
	);
	let answerAPI = `https://www.zhihu.com/api/v4/questions/${questionId}/answers?include=${includeContent}?offset=${offset}`;
	httpClient(answerAPI, { json: true }, (err, _res, body: QuestionAnswers) => {
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
	});
}
