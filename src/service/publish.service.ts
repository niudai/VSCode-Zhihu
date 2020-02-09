
import * as vscode from "vscode";
import { IProfile, ITarget } from "../model/target/target";
import { HttpService } from "./http.service";
import MarkdownIt = require("markdown-it");
import { WebviewService } from "./webview.service";
import { join } from "path";
import { TemplatePath } from "../const/PATH";
import { AnswerAPI, QuestionAPI, ZhuanlanAPI, AnswerURL, ZhuanlanURL } from "../const/URL";
import { unescapeMd, escapeHtml } from "../util/md-html-utils";
import { CollectionService, ICollectionItem } from "./collection.service";
import { MediaTypes } from "../const/ENUM";
import { PostAnswer } from "../model/publish/answer.model";
import { QuestionAnswerPathReg, QuestionPathReg } from "../const/REG";
import { Url } from "url";

enum previewActions {
	openInBrowser = '去看看'
}

export class PublishService {
	public profile: IProfile;

	constructor(protected context: vscode.ExtensionContext,
		protected httpService: HttpService,
		protected zhihuMdParser: MarkdownIt,
		protected defualtMdParser: MarkdownIt,
		protected webviewService: WebviewService,
		protected collectionService: CollectionService
	) {
		zhihuMdParser.renderer.rules.fence = function (tokens, idx, options, env, self) {
			var token = tokens[idx],
				info = token.info ? unescapeMd(token.info).trim() : '',
				langName = '',
				highlighted, i, tmpAttrs, tmpToken;

			if (info) {
				langName = info.split(/\s+/g)[0];
			}

			if (options.highlight) {
				highlighted = options.highlight(token.content, langName) || escapeHtml(token.content);
			} else {
				highlighted = escapeHtml(token.content);
			}

			if (highlighted.indexOf('<pre') === 0) {
				return highlighted + '\n';
			}

			// If language exists, inject class gently, without modifying original token.
			// May be, one day we will add .clone() for token and simplify this part, but
			// now we prefer to keep things local.
			if (info) {
				i = token.attrIndex('lang');
				tmpAttrs = token.attrs ? token.attrs.slice() : [];

				if (i < 0) {
					tmpAttrs.push(['lang', langName]);
				} else {
					tmpAttrs[i][1] += ' ' + langName;
				}

				// Fake token just to render attributes
				tmpToken = {
					attrs: tmpAttrs
				};

				return '<pre' + zhihuMdParser.renderer.renderAttrs(tmpToken) + '>'
					+ highlighted
					+ '</pre>\n';
			}


			return '<pre' + zhihuMdParser.renderer.renderAttrs(token) + '>'
				+ highlighted
				+ '</pre>\n';
		};
	}

	preview(textEdtior: vscode.TextEditor, edit: vscode.TextEditorEdit) {
		let text = textEdtior.document.getText();
		let url: URL = this.shebangParser(text);
		// get rid of shebang line
		if (url) text = text.slice(text.indexOf('\n') + 1);
		let html = this.zhihuMdParser.render(text);
		this.webviewService.renderHtml({
			title: '预览',
			pugTemplatePath: join(this.context.extensionPath, TemplatePath, 'pre-publish.pug'),
			pugObjects: {
				title: '答案预览',
				content: html
			},
			showOptions: {
				viewColumn: vscode.ViewColumn.Beside,
				preserveFocus: true
			}
		});
	}

	async publish(textEdtior: vscode.TextEditor, edit: vscode.TextEditorEdit) {
		let text = textEdtior.document.getText();

		let url: URL = this.shebangParser(text);

		// get rid of shebang line
		if (url) text = text.slice(text.indexOf('\n') + 1);

		let html = this.zhihuMdParser.render(text);
		html.replace('\"', '\\\"');


		if (url) {
			// just publish answer in terms of what shebang indicates
			if (QuestionAnswerPathReg.test(url.pathname)) {
				// answer link, update answer
				let aId = url.pathname.replace(QuestionAnswerPathReg, '$2');
				this.putAnswer(html, aId);
			} else if (QuestionPathReg.test(url.pathname)) {
				// question link, post new answer
				let qId = url.pathname.replace(QuestionPathReg, '$1');
				this.postAnswer(html, qId);
			}
		} else {
			const selectFrom: MediaTypes = await vscode.window.showQuickPick<vscode.QuickPickItem & { value: MediaTypes }>(
				[
					{ label: '发布新文章', description: '', value: MediaTypes.article },
					{ label: '从收藏夹中选取', description: '', value: MediaTypes.answer }
				]
			).then(item => item.value);

			if (selectFrom === MediaTypes.article) {
				this.postArticle(html)
			} else if (selectFrom === MediaTypes.answer) {
				// shebang not found, then prompt a quick pick to select a question from collections
				const selectedTarget: ICollectionItem = await vscode.window.showQuickPick<vscode.QuickPickItem & ICollectionItem>(
					this.collectionService.getTargets().then(
						(targets) => {
							let items = targets.map(t => ({ label: t.title ? t.title : t.excerpt, description: t.excerpt, id: t.id, type: t.type }));
							return items;
						}
					)
				).then(item => ({ id: item.id, type: item.type }));
				if (selectedTarget.type == MediaTypes.question) {
					this.postAnswer(html, selectedTarget.id);
				} else if (selectedTarget.type == MediaTypes.answer) {
					this.putAnswer(html, selectedTarget.id);
				} else if (selectedTarget.type == MediaTypes.article) {

					this.postArticle(html)
				}
			}
		}
	}

	private putAnswer(html: string, answerId: string) {
		this.httpService.sendRequest({
			uri: `${AnswerAPI}/${answerId}`,
			method: 'put',
			body: {
				content: html,
				reward_setting: { "can_reward": false, "tagline": "" },
			},
			json: true,
			resolveWithFullResponse: true,
			headers: {},
		}).then(resp => {
			if (resp.statusCode === 200) {
				let newUrl = `${AnswerURL}/${answerId}`;
				this.promptSuccessMsg(newUrl);
				const pane = vscode.window.createWebviewPanel('zhihu', 'zhihu', vscode.ViewColumn.One, { enableScripts: true, enableCommandUris: true, enableFindWidget: true });
				this.httpService.sendRequest({ uri: `${AnswerURL}/${answerId}`, gzip: true }).then(
					resp => {
						pane.webview.html = resp
					}
				);
			} else {
				vscode.window.showWarningMessage(`发布失败！错误代码 ${resp.statusCode}`)
			}
		})
	}

	private postAnswer(html: string, questionId: string) {
		this.httpService.sendRequest({
			uri: `${QuestionAPI}/${questionId}/answers`,
			method: 'post',
			body: new PostAnswer(html),
			json: true,
			resolveWithFullResponse: true,
			headers: {}
		}).then(resp => {
			if (resp.statusCode == 200) {
				let newUrl = `${AnswerURL}/${resp.body.id}`;
				this.promptSuccessMsg(newUrl);
				const pane = vscode.window.createWebviewPanel('zhihu', 'zhihu', vscode.ViewColumn.One, { enableScripts: true, enableCommandUris: true, enableFindWidget: true });
				this.httpService.sendRequest({ uri: `${AnswerURL}/${resp.body.id}`, gzip: true }).then(
					resp => {
						pane.webview.html = resp
					}
				);
			} else {
				if (resp.statusCode == 400) {
					vscode.window.showWarningMessage(`发布失败，你已经在该问题下发布过答案，请将头部链接更改为\
					已回答的问题下的链接。`)
				} else {
					vscode.window.showWarningMessage(`发布失败！错误代码 ${resp.statusCode}`)
				}
			}
		})
	}

	private async postArticle(content: string) {
		const title: string | undefined = await vscode.window.showInputBox({
			ignoreFocusOut: true,
			prompt: "输入文章标题：",
			placeHolder: ""
		})
		if (!title) return;

		let postResp: ITarget = await this.httpService.sendRequest({
			uri: `${ZhuanlanAPI}/drafts`,
			json: true,
			method: 'post',
			body: { "title": "h", "delta_time": 0 },
			headers: {}
		})

		let patchResp = await this.httpService.sendRequest({
			uri: `${ZhuanlanAPI}/${postResp.id}/draft`,
			json: true,
			method: 'patch',
			body: {
				content: content,
				title: title
			},
			headers: {}
		})

		let resp = await this.httpService.sendRequest({
			uri: `${ZhuanlanAPI}/${postResp.id}/publish`,
			json: true,
			method: 'put',
			body: { "column": null, "commentPermission": "anyone" },
			headers: {},
			resolveWithFullResponse: true
		})
		if (resp.statusCode < 300) {
			this.promptSuccessMsg(`${ZhuanlanURL}${postResp.id}`)
		} else {
			vscode.window.showWarningMessage(`文章发布失败，错误代码${resp.statusCode}`)
		}
		return resp;
	}

	private promptSuccessMsg(url: string) {
		vscode.window.showInformationMessage(`发布成功！\n`, { modal: true }, 
		previewActions.openInBrowser
		).then(r => r ? vscode.env.openExternal(vscode.Uri.parse(url)) : undefined);
	}


	shebangParser(text: string): URL {
		let shebangRegExp = /#!\s*((https?:\/\/)?(.+))$/i
		let lf = text.indexOf('\n');
		if (lf < 0) lf = text.length;
		let link = text.slice(0, lf - 1);
		if (!shebangRegExp.test(link)) return undefined;
		let url = new URL(link.replace(shebangRegExp, '$1'));
		if (url.host === 'www.zhihu.com') return url;
		else return undefined;
		// shebangRegExp = /(https?:\/\/)/i
	}
}