
import * as path from "path";
import { compileFile } from "pug";
import * as vscode from "vscode";
import { MediaTypes } from "../const/ENUM";
import { TemplatePath, ZhihuIconPath } from "../const/PATH";
import { AnswerAPI, QuestionAPI } from "../const/URL";
import { IArticle } from "../model/article/article-detail";
import { IQuestionAnswerTarget, IQuestionTarget, ITarget } from "../model/target/target";
import { CollectionTreeviewProvider } from "../treeview/collection-treeview-provider";
import { CollectionService, ICollectionItem } from "./collection.service";
import { HttpService } from "./http.service";

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
		protected httpService: HttpService,
		protected collectService: CollectionService,
		protected collectionTreeviewProvider: CollectionTreeviewProvider 
		) {
	}

	/**
	 * Create and show a webview provided by pug
	 */
	public 	renderHtml(w: IWebviewPugRender, panel?: vscode.WebviewPanel): vscode.WebviewPanel {
		if (panel == undefined) {
			panel = vscode.window.createWebviewPanel(
				w.viewType ? w.viewType : 'zhihu',
				w.title ? w.title : '知乎',
				w.showOptions ? w.showOptions : vscode.ViewColumn.One,
				w.options ? w.options : { enableScripts: true }
			);	
		}
		const compiledFunction = compileFile(
			w.pugTemplatePath
		);
		panel.iconPath = vscode.Uri.file(w.iconPath ? w.iconPath : path.join(
			this.context.extensionPath,
			ZhihuIconPath));
		panel.webview.html = compiledFunction(w.pugObjects);
		return panel;
	}

	public async openWebview(object: ITarget & any) {
		if (object.type == MediaTypes.question) {

			const includeContent = "data[*].is_normal,content;";
			let offset = 0;
			let questionAPI = `${QuestionAPI}/${object.id}?include=detail%2cexcerpt`;
			let answerAPI = `${QuestionAPI}/${object.id}/answers?include=${includeContent}?offset=${offset}`;
			let question: IQuestionTarget = await this.httpService.sendRequest({
				uri: questionAPI,
				json: true,
				gzip: true
			});
			let body: { data: IQuestionAnswerTarget[] } = await this.httpService.sendRequest({
				uri: answerAPI,
				json: true,
				gzip: true
			});
			let useVSTheme = vscode.workspace.getConfiguration('zhihu').get('useVSTheme');
			
			let panel = this.renderHtml({
				title: "知乎问题",
				pugTemplatePath: path.join(
					this.context.extensionPath,
					TemplatePath,
					"questions-answers.pug"
				),
				pugObjects: {
					answers: body.data.map(t => { return this.actualSrcNormalize(t.content) }),
					title: question.title,
					subTitle: question.detail,
					useVSTheme: useVSTheme
				}
			})
			this.registerCollectEvent(panel, { type: MediaTypes.question, id: object.id });

		} else if (object.type == MediaTypes.answer) {
			let body = await this.httpService.sendRequest({
				uri: `${AnswerAPI}/${object.id}?include=data[*].content,excerpt`,
				json: true,
				gzip: true
			})
			let useVSTheme = vscode.workspace.getConfiguration('zhihu').get('useVSTheme');

			let panel = this.renderHtml({
				title: "知乎回答",
				pugTemplatePath: path.join(
					this.context.extensionPath,
					TemplatePath,
					"questions-answers.pug"
				),
				pugObjects: {
					answers: [this.actualSrcNormalize(body.content)],
					title: object.question.name,
					useVSTheme
				}
			})
			this.registerCollectEvent(panel, { type: MediaTypes.answer, id: object.id })
		} else if (object.type == MediaTypes.article) {
			let article: IArticle = await this.httpService.sendRequest({
				uri: object.url,
				json: true,
				gzip: true,
				headers: null
			});
			let useVSTheme = vscode.workspace.getConfiguration('zhihu').get('useVSTheme');

			let panel = this.renderHtml({
				title: "知乎文章",
				pugTemplatePath: path.join(
					this.context.extensionPath,
					TemplatePath,
					"article.pug"
				),
				pugObjects: {
					content: this.actualSrcNormalize(article.content),
					title: article.title,
					useVSTheme
				}
			})
			this.registerCollectEvent(panel, { type: MediaTypes.article, id: object.id })
		}		
	}

	private registerCollectEvent(panel: vscode.WebviewPanel, c: ICollectionItem) {
		panel.webview.onDidReceiveMessage(e => {
			if (e.command == 'collect') {
				if(this.collectService.addItem(c)) {
					vscode.window.showInformationMessage('收藏成功！');
				} else {
					vscode.window.showWarningMessage('你已经收藏了它！');
				}
				this.collectionTreeviewProvider.refresh()
			}
		}, undefined, this.context.subscriptions)
	}

	private actualSrcNormalize(html: string): string {
		return html.replace(/<\/?noscript>/, '');
	}
}