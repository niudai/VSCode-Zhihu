
import { compileFile } from "pug";
import * as vscode from "vscode";
import { ITarget, IQuestionAnswerTarget } from "../model/target/target";
import { HttpService } from "./http.service";
import { TemplatePath, LightIconPath } from "../const/PATH";
import * as path from "path";
import { IArticle } from "../model/article/article-detail";

export interface IWebviewPugRender {
	viewType: string,
	title: string,
	showOptions: vscode.ViewColumn | { viewColumn: vscode.ViewColumn, preserveFocus?: boolean},
	options?: vscode.WebviewOptions & vscode.WebviewPanelOptions,
	pugTemplatePath: string,
	pugObjects?: any,
	iconPath: any
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
				w.viewType,
				w.title,
				w.showOptions,
				w.options
			);	
		}
		const compiledFunction = compileFile(
			w.pugTemplatePath
		);
		panel.iconPath = vscode.Uri.file(w.iconPath);
		panel.webview.html = compiledFunction(w.pugObjects);
	}

	public async openWebview(object: ITarget & any) {
		if (object.type == 'question') {

			const includeContent = "data[*].is_normal,content;";
			let offset = 0;
			let answerAPI = `https://www.zhihu.com/api/v4/questions/${object.id}/answers?include=${includeContent}?offset=${offset}`;
			let body: { data: IQuestionAnswerTarget } = await this.httpService.sendRequest({
				uri: answerAPI,
				json: true,
				gzip: true
			});
	
			this.renderHtml({
				viewType: "zhihu",
				title: "知乎问题",
				showOptions: vscode.ViewColumn.One,
				pugTemplatePath: path.join(
					this.context.extensionPath,
					TemplatePath,
					"questions-answers.pug"
				),
				iconPath: path.join(
					this.context.extensionPath,
					LightIconPath,
					'zhihu-logo-material.svg'),
				pugObjects: {
					answers: body.data,
					title: body.data[0].question.title
					// title: body.data[0].question.title
				}
			})
		} else if (object.type == 'answer') {
			this.renderHtml({
				viewType: "zhihu",
				title: "知乎回答",
				showOptions: vscode.ViewColumn.One,
				pugTemplatePath: path.join(
					this.context.extensionPath,
					TemplatePath,
					"questions-answers.pug"
				),
				iconPath: path.join(
					this.context.extensionPath,
					LightIconPath,
					'zhihu-logo-material.svg'),
				pugObjects: {
					answers: [object],
					title: object.question.name
				}
			})
		} else if (object.type == 'article') {
			let article: IArticle = await this.httpService.sendRequest({
				uri: object.url,
				json: true,
				gzip: true,
				headers: null
			});
			this.renderHtml({
				viewType: "zhihu",
				title: "知乎文章",
				showOptions: vscode.ViewColumn.One,
				pugTemplatePath: path.join(
					this.context.extensionPath,
					TemplatePath,
					"article.pug"
				),
				iconPath: path.join(
					this.context.extensionPath,
					LightIconPath,
					'zhihu-logo-material.svg'),
				pugObjects: {
					content: article.content,
					title: article.title
				}
			})
		}		
	}
}