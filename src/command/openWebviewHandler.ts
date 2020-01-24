import * as path from "path";
import * as pug from "pug";
import * as httpClient from "request-promise";
import * as vscode from "vscode";
import { IArticle } from "../model/article/article-detail";
import { IQuestionAnswerTarget, ITarget } from "../model/target/target";
import { sendRequestWithCookie } from "../util/sendRequestWithCookie";
import { WebviewService } from "../service/webview.service";
import { TemplatePath, IconPath } from "../const/PATH";

export async function openWebviewHandler(
	object: ITarget,
	context: vscode.ExtensionContext,
	webviewService: WebviewService
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
		webviewService.renderHtml({
			viewType: "zhihu",
			title: "知乎回答",
			showOptions: vscode.ViewColumn.One,
			pugTemplatePath: path.join(
				context.extensionPath,
				TemplatePath,
				"questions-answers.pug"
			),
			iconPath: path.join(
				context.extensionPath,
				IconPath,
				'zhihu-logo-material.svg'),
			pugObjects: {
				answers: [object]
			}
		})
	} else if (object.type == 'article') {

		const panel = vscode.window.createWebviewPanel(
			"zhihu",
			"知乎文章",
			vscode.ViewColumn.One,
			{}
		);
		let article: IArticle = await sendRequestWithCookie({
			uri: object.url,
			json: true,
			gzip: true,
			headers: null
		}, context);

		const compiledFunction = pug.compileFile(
			path.join(
				context.extensionPath,
				"src",
				"template",
				"article.pug"
			)
		)
		panel.iconPath = vscode.Uri.file(path.join(context.extensionPath, 'media', 'zhihu-logo-material.svg'));
		panel.webview.html = compiledFunction({
			content: article.content,
			title: article.title
		});
	}
}
