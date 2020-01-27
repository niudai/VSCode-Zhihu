import * as path from "path";
import * as vscode from "vscode";
import { LightIconPath, TemplatePath } from "../const/PATH";
import { IArticle } from "../model/article/article-detail";
import { IQuestionAnswerTarget, ITarget } from "../model/target/target";
import { HttpService } from "../service/http.service";
import { WebviewService } from "../service/webview.service";

export async function openWebviewHandler(
	object: ITarget & any,
	context: vscode.ExtensionContext,
	webviewService: WebviewService,
	httpService: HttpService
): Promise<void> {

	if (object.type == 'question') {

		const includeContent = "data[*].is_normal,content;";
		let offset = 0;
		let answerAPI = `https://www.zhihu.com/api/v4/questions/${object.id}/answers?include=${includeContent}?offset=${offset}`;
		let body: { data: IQuestionAnswerTarget } = await httpService.sendRequest({
			uri: answerAPI,
			json: true,
			gzip: true
		});

		webviewService.renderHtml({
			viewType: "zhihu",
			title: "知乎问题",
			showOptions: vscode.ViewColumn.One,
			pugTemplatePath: path.join(
				context.extensionPath,
				TemplatePath,
				"questions-answers.pug"
			),
			iconPath: path.join(
				context.extensionPath,
				LightIconPath,
				'zhihu-logo-material.svg'),
			pugObjects: {
				answers: body.data,
				title: body.data[0].question.title
				// title: body.data[0].question.title
			}
		})
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
				LightIconPath,
				'zhihu-logo-material.svg'),
			pugObjects: {
				answers: [object],
				title: object.question.name
			}
		})
	} else if (object.type == 'article') {
		let article: IArticle = await httpService.sendRequest({
			uri: object.url,
			json: true,
			gzip: true,
			headers: null
		});
		webviewService.renderHtml({
			viewType: "zhihu",
			title: "知乎文章",
			showOptions: vscode.ViewColumn.One,
			pugTemplatePath: path.join(
				context.extensionPath,
				TemplatePath,
				"article.pug"
			),
			iconPath: path.join(
				context.extensionPath,
				LightIconPath,
				'zhihu-logo-material.svg'),
			pugObjects: {
				content: article.content,
				title: article.title
			}
		})
	}
}
