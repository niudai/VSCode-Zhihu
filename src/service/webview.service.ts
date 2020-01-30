
import { compileFile } from "pug";
import * as vscode from "vscode";
import { ITarget, IQuestionAnswerTarget } from "../model/target/target";
import { HttpService } from "./http.service";
import { TemplatePath, LightIconPath, ZhihuIconName } from "../const/PATH";
import * as path from "path";
import { IArticle } from "../model/article/article-detail";
import { QuestionAPI } from "../const/URL";
import { MediaTypes } from "../const/ENUM";

export interface IWebviewPugRender {
	viewType?: string,
	title?: string,
	showOptions?: vscode.ViewColumn | { viewColumn: vscode.ViewColumn, preserveFocus?: boolean},
	options?: vscode.WebviewOptions & vscode.WebviewPanelOptions,
	pugTemplatePath: string,
	pugObjects?: any,
	iconPath?: any
}

export class WebviewService {

	constructor (
		protected context: vscode.ExtensionContext,
		protected httpService: HttpService) {
	}

	/**
	 * Create and show a webview provided by pug
	 */
	public 	renderHtml(w: IWebviewPugRender, panel?: vscode.WebviewPanel) {
		if (panel == undefined) {
			panel = vscode.window.createWebviewPanel(
				w.viewType ? w.viewType : 'zhihu',
				w.title ? w.title : '知乎',
				w.showOptions ? w.showOptions : vscode.ViewColumn.One,
				w.options
			);	
		}
		const compiledFunction = compileFile(
			w.pugTemplatePath
		);
		panel.iconPath = vscode.Uri.file(w.iconPath ? w.iconPath : path.join(
			this.context.extensionPath,
			ZhihuIconName));
		panel.webview.html = compiledFunction(w.pugObjects);
	}

	public async openWebview(object: ITarget & any) {
		if (object.type == MediaTypes.question) {

			const includeContent = "data[*].is_normal,content;";
			let offset = 0;
			let answerAPI = `${QuestionAPI}/${object.id}/answers?include=${includeContent}?offset=${offset}`;
			let body: { data: IQuestionAnswerTarget } = await this.httpService.sendRequest({
				uri: answerAPI,
				json: true,
				gzip: true
			});

			this.renderHtml({
				title: "知乎问题",
				pugTemplatePath: path.join(
					this.context.extensionPath,
					TemplatePath,
					"questions-answers.pug"
				),
				pugObjects: {
					answers: body.data,
					title: body.data[0].question.title
				}
			})
		} else if (object.type == MediaTypes.answer) {
			this.renderHtml({
				title: "知乎回答",
				pugTemplatePath: path.join(
					this.context.extensionPath,
					TemplatePath,
					"questions-answers.pug"
				),
				pugObjects: {
					answers: [object],
					title: object.question.name
				}
			})
		} else if (object.type == MediaTypes.article) {
			let article: IArticle = await this.httpService.sendRequest({
				uri: object.url,
				json: true,
				gzip: true,
				headers: null
			});
			this.renderHtml({
				title: "知乎文章",
				pugTemplatePath: path.join(
					this.context.extensionPath,
					TemplatePath,
					"article.pug"
				),
				pugObjects: {
					content: article.content,
					title: article.title
				}
			})
		}		
	}
}