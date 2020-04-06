
import { join } from "path";
import * as vscode from "vscode";
import { MediaTypes, SettingEnum } from "../const/ENUM";
import { TemplatePath } from "../const/PATH";
import { ArticlePathReg, QuestionAnswerPathReg, QuestionPathReg, ZhihuPicReg } from "../const/REG";
import { AnswerAPI, AnswerURL, QuestionAPI, ZhuanlanAPI, ZhuanlanURL } from "../const/URL";
import { PostAnswer } from "../model/publish/answer.model";
import { IColumn } from "../model/publish/column.model";
import { IProfile, ITarget, ITopicTarget } from "../model/target/target";
import { beautifyDate, removeHtmlTag } from "../util/md-html-utils";
import { CollectionService, ICollectionItem } from "./collection.service";
import { EventService } from "./event.service";
import { HttpService, sendRequest } from "./http.service";
import { ProfileService } from "./profile.service";
import { WebviewService } from "./webview.service";
import * as MarkdownIt from "markdown-it";
import md5 = require("md5");
import { PasteService } from "./paste.service";
import { PipeService } from "./pipe.service";
import { getExtensionPath } from "../global/globa-var";

enum previewActions {
	openInBrowser = '去看看'
}

interface TimeObject {
	hour: number,
	minute: number,

	/**
	 * interval in millisec
	 */
	date: Date
}

export class PublishService {
	public profile: IProfile;

	constructor(
		protected zhihuMdParser: MarkdownIt,
		protected defualtMdParser: MarkdownIt,
		protected webviewService: WebviewService,
		protected collectionService: CollectionService,
		protected eventService: EventService,
		protected profileService: ProfileService,
		protected pasteService: PasteService,
		protected pipeService: PipeService
	) {
		this.registerPublishEvents();
	}

	/**
	 * When extension starts, all publish events should be re-registered,
	 * this is what pre-log tech comes in. 
	 */
	private registerPublishEvents() {
		let events = this.eventService.getEvents();
		events.forEach(e => {
			e.timeoutId = setTimeout(() => {
				this.postArticle(e.content, e.title);
				this.eventService.destroyEvent(e.hash);
			}, e.date.getTime() - Date.now());
		})
	}

	preview(textEdtior: vscode.TextEditor, edit: vscode.TextEditorEdit) {
		let text = textEdtior.document.getText();
		let url: URL = this.shebangParser(text);
		// get rid of shebang line
		if (url) text = text.slice(text.indexOf('\n') + 1);
		let html = this.zhihuMdParser.render(text);
		this.webviewService.renderHtml({
			title: '预览',
			pugTemplatePath: join(getExtensionPath(), TemplatePath, 'pre-publish.pug'),
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
		let title: string;
		let titleImage: string;
		let bgIndex: number;
		let text = textEdtior.document.getText();
		const url: URL = this.shebangParser(text);
		const timeObject: TimeObject = { hour: 0, date: new Date(), minute: 0 };
		// get rid of shebang line
		if (url) text = text.slice(text.indexOf('\n') + 1);

		// let html = this.zhihuMdParser.render(text);
		let tokens = this.zhihuMdParser.parse(text, {});
		// convert local and outer link to zhihu link
		let pipePromise = this.pipeService.sanitizeMdTokens(tokens);
		vscode.window.withProgress({
			location: vscode.ProgressLocation.Window,
			cancellable: false,
			title: '文章发布中...'
		}, (progress, token) => {
			return Promise.resolve(pipePromise);
		})
		await pipePromise;
		
		let html = this.zhihuMdParser.renderer.render(tokens, {}, {});
		const openIndex = tokens.findIndex(t => t.type == 'heading_open' && t.tag == 'h1');
		const endIndex = tokens.findIndex(t => t.type == 'heading_close' && t.tag == 'h1');
		if (openIndex >= 0) {
			title = removeHtmlTag(this.zhihuMdParser.renderInline(tokens[openIndex+1].content));
			for (let i = 0; i < openIndex; i++) {
				if(tokens[i].type === 'inline') {
					for (let c of tokens[i].children) {
						if(c.type === 'image') {
							let tmp = c.attrs.find(a => a[0] === 'src')
							titleImage = tmp[1];
							bgIndex = i;
						}
					}
				}
			}
		}

		const pubLater = await vscode.window.showQuickPick<vscode.QuickPickItem & { value: boolean }>(
			[
				{ label: '立即发布', description: '', value: false },
				{ label: '稍后发布', description: '', value: true }
			]
		).then(item => item.value);

		if (pubLater == undefined) return;

		if (pubLater) {
			let ClockReg = /^(\d\d?)[:：](\d\d)\s*([ap]m)\s*$/i
			let timeStr: string | undefined = await vscode.window.showInputBox({
				ignoreFocusOut: true,
				prompt: "输入发布时间，如 5:30 pm, 6:40 am 等，目前只支持当天发布！",
				placeHolder: "",
				validateInput: (s: string) => {
					if (!ClockReg.test(s)) return '请输入正确的时间格式！'
					if (parseInt(s.replace(ClockReg, '$1')) > 12 || parseInt(s.replace(ClockReg, '$2')) > 60) return '请输入正确的时间格式！'
					return ''
				}
			});
			let h = parseInt(timeStr.replace(ClockReg, '$1')), m = parseInt(timeStr.replace(ClockReg, '$2')), aOrPm = timeStr.replace(ClockReg, '$3');
			if (!timeStr) return;
			timeStr = timeStr.trim();
			/**
			 * the time interval between now and the publish time in millisecs.
			 */
			timeObject.date.setHours(aOrPm == 'am' ? h : h + 12);
			timeObject.date.setMinutes(m);
			if (timeObject.date.getTime() < Date.now()) {
				vscode.window.showWarningMessage('不能选择比现在更早的时间！');
				return;
			}
		}

		if (url) { // If url is provided
			// just publish answer in terms of what shebang indicates
			if (QuestionAnswerPathReg.test(url.pathname)) {
				// answer link, update answer
				let aId = url.pathname.replace(QuestionAnswerPathReg, '$3');
				if (!this.eventService.registerEvent({
					content: html,
					type: MediaTypes.article,
					date: timeObject.date,
					hash: md5(html),
					handler: () => {
						this.putAnswer(html, aId);
						this.eventService.destroyEvent(md5(html));
					}
				})) this.promptSameContentWarn()
				else this.promptEventRegistedInfo(timeObject)
			} else if (QuestionPathReg.test(url.pathname)) {
				// question link, post new answer
				let qId = url.pathname.replace(QuestionPathReg, '$1');
				if (!this.eventService.registerEvent({
					content: html,
					type: MediaTypes.question,
					date: timeObject.date,
					hash: md5(html),
					handler: () => {
						this.postAnswer(html, qId);
						this.eventService.destroyEvent(md5(html));
					}
				})) this.promptSameContentWarn()
				else this.promptEventRegistedInfo(timeObject)
			} else if (ArticlePathReg.test(url.pathname)) {
				({ tokens, html } = this.removeTitleAndBgFromContent(tokens, openIndex, bgIndex, html));
				let arId = url.pathname.replace(ArticlePathReg, '$1');
				if (!title) {
					title = await this._getTitle();
				}
				let column = await this._selectColumn();
				if (!column) {
					vscode.window
				}
				if (!this.eventService.registerEvent({
					content: html,
					type: MediaTypes.question,
					date: timeObject.date,
					title: title,
					hash: md5(html),
					handler: () => {
						this.putArticle(html, arId, title, column, titleImage);
						this.eventService.destroyEvent(md5(html));
					}
				})) this.promptSameContentWarn()
				else this.promptEventRegistedInfo(timeObject)
			}
		} else { // url is not provided
			const selectFrom: MediaTypes = await vscode.window.showQuickPick<vscode.QuickPickItem & { value: MediaTypes }>(
				[
					{ label: '发布新文章', description: '', value: MediaTypes.article },
					{ label: '从收藏夹中选取', description: '', value: MediaTypes.answer }
				]
			).then(item => item.value);

			if (selectFrom === MediaTypes.article) {
				({ tokens, html } = this.removeTitleAndBgFromContent(tokens, openIndex, bgIndex, html));

				// user select to publish new article
				if (!title) {
					title = await this._getTitle();					
				}
				let column = await this._selectColumn();
				if (!title) return;
				if (!this.eventService.registerEvent({
					content: html,
					type: MediaTypes.article,
					title,
					date: timeObject.date,
					hash: md5(html + title),
					handler: () => {
						this.postArticle(html, title, column, titleImage);
						this.eventService.destroyEvent(md5(html + title));
					}
				})) this.promptSameContentWarn()
				else this.promptEventRegistedInfo(timeObject)

			} else if (selectFrom === MediaTypes.answer) {
				// user select from collection
				// shebang not found, then prompt a quick pick to select a question from collections
				const selectedTarget: ICollectionItem | undefined = await vscode.window.showQuickPick<vscode.QuickPickItem & ICollectionItem>(
					this.collectionService.getTargets(MediaTypes.question).then(
						(targets) => {
							let items = targets.map(t => ({ label: t.title ? t.title : t.excerpt, description: t.excerpt, id: t.id, type: t.type }));
							return items;
						}
					)
				).then(item => (item ? { id: item.id, type: item.type } : undefined));
				if (!selectedTarget) return;
				if (!this.eventService.registerEvent({
					content: html,
					type: MediaTypes.article,
					date: timeObject.date,
					hash: md5(html),
					handler: () => {
						this.postAnswer(html, selectedTarget.id);
						this.eventService.destroyEvent(md5(html));
					}
				})) this.promptSameContentWarn();
				else this.promptEventRegistedInfo(timeObject);
			}
		}
	}

	private removeTitleAndBgFromContent(tokens, openIndex: number, bgIndex: number, html: string) {
		tokens = tokens.filter(this._removeTitleAndBg(openIndex, bgIndex));
		html = this.zhihuMdParser.renderer.render(tokens, {}, {});
		return { tokens, html };
	}

	private _removeTitleAndBg(openIndex: number, bgIndex: number) {
		return (t, i) => Math.abs(openIndex + 1 - i) > 1 && bgIndex != i;
	}

	private promptEventRegistedInfo(timeObject: TimeObject) {
		if (timeObject.date.getTime() > Date.now()) {
			vscode.window.showInformationMessage(`答案将在 ${beautifyDate(timeObject.date)} 发布，请发布时保证VSCode处于打开状态，并` +
				`激活知乎插件`);
		}
	}

	private promptSameContentWarn() {
		vscode.window.showWarningMessage(`你已经有一篇一模一样的内容还未发布！`);
	}

	private async _getTitle(): Promise<string | undefined> {
		return vscode.window.showInputBox({
			ignoreFocusOut: true,
			prompt: "输入标题：",
			placeHolder: "",
		});
	}

	// private async _getTopics(): Promise<ITopicTarget[] | undefined> {
	// 	topics
	// 	vscode.window.showQuickPick<vscode.QuickPickItem & { value: ITopicTarget }>(
	// 		[{ label: '不发布到专栏', value: undefined }].concat(columns.map(c => ({ label: c.title, value: c }))), 
	// 		{
	// 		ignoreFocusOut: true,
		
	// 		}
	// 	).then(item => item.value);
	// }

	private async _selectColumn(): Promise<IColumn | undefined> {
		const columns = await this.profileService.getColumns();
		if (!columns || columns.length === 0) return;
		return vscode.window.showQuickPick<vscode.QuickPickItem & { value: IColumn }>(
			[{ label: '不发布到专栏', value: undefined }].concat(columns.map(c => ({ label: c.title, value: c }))), 
			{
			ignoreFocusOut: true,
		
			}
		).then(item => item.value);
	}

	public putAnswer(html: string, answerId: string) {
		sendRequest({
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
				sendRequest({ uri: `${AnswerURL}/${answerId}`, gzip: true }).then(
					resp => {
						pane.webview.html = resp
					}
				);
			} else {
				vscode.window.showWarningMessage(`发布失败！错误代码 ${resp.statusCode}`)
			}
		})
	}

	public postAnswer(html: string, questionId: string) {
		sendRequest({
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
				// const pane = vscode.window.createWebviewPanel('zhihu', 'zhihu', vscode.ViewColumn.One, { enableScripts: true, enableCommandUris: true, enableFindWidget: true });
				// sendRequest({ uri: `${AnswerURL}/${resp.body.id}`, gzip: true }).then(
				// 	resp => {
				// 		pane.webview.html = resp
				// 	}
				// );
				const editor = vscode.window.activeTextEditor;
				const uri = editor.document.uri;
				editor.edit(e => {
					e.replace(editor.document.lineAt(0).range, `#! ${newUrl}\n`)
				})
			} else {
				if (resp.statusCode == 400 || resp.statusCode == 403) {
					vscode.window.showWarningMessage(`发布失败，你已经在该问题下发布过答案，请将头部链接更改为\
					已回答的问题下的链接。`)
				} else {
					vscode.window.showWarningMessage(`发布失败！错误代码 ${resp.statusCode}`)
				}
			}
		})
	}

	public async postArticle(content: string, title?: string, column?: IColumn, titleImage?: string) {
		if (!title) {
			title = await vscode.window.showInputBox({
				ignoreFocusOut: true,
				prompt: "输入文章标题：",
				placeHolder: ""
			})
		}
		if (!title) return;

		let postResp: ITarget = await sendRequest({
			uri: `${ZhuanlanAPI}/drafts`,
			json: true,
			method: 'post',
			body: { "title": "h", "delta_time": 0 },
			headers: {
				'authority': 'zhuanlan.zhihu.com',
				'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4101.0 Safari/537.36 Edg/83.0.474.0',
				'origin': 'https://zhuanlan.zhihu.com',
				'sec-fetch-site': 'same-origin',
				'sec-fetch-mode': 'cors',
				'sec-fetch-dest': 'empty',
				'referer': 'https://zhuanlan.zhihu.com/write',
				'x-requested-with': 'fetch'
			}
		})

		let patchResp = await sendRequest({
			uri: `${ZhuanlanAPI}/${postResp.id}/draft`,
			json: true,
			method: 'patch',
			body: {
				content: content,
				title: title,
				titleImage,
				isTitleImageFullScreen: vscode.workspace.getConfiguration('zhihu').get(SettingEnum.isTitleImageFullScreen)
			},
			headers: {}
		})

		let resp = await sendRequest({
			uri: `${ZhuanlanAPI}/${postResp.id}/publish`,
			json: true,
			method: 'put',
			body: { "column": column, "commentPermission": "anyone" },
			headers: {},
			resolveWithFullResponse: true
		})
		if (resp.statusCode < 300) {
			const editor = vscode.window.activeTextEditor;
			editor.edit(e => {
				e.insert(new vscode.Position(0, 0), `#! ${ZhuanlanURL}${postResp.id}\n`)
			})
			this.promptSuccessMsg(`${ZhuanlanURL}${postResp.id}`, title)
		} else {
			vscode.window.showWarningMessage(`文章发布失败，错误代码${resp.statusCode}`)
		}
		return resp;
	}

	public async putArticle(content: string, articleId: string, title?: string, column?: IColumn, titleImage?: string) {
		if (!title) {
			title = await vscode.window.showInputBox({
				ignoreFocusOut: true,
				prompt: "修改文章标题：",
				placeHolder: ""
			})
		}
		if (!title) return;

		let patchResp = await sendRequest({
			uri: `${ZhuanlanAPI}/${articleId}/draft`,
			json: true,
			method: 'patch',
			body: {
				content: content,
				title: title,
				titleImage,
				isTitleImageFullScreen: vscode.workspace.getConfiguration('zhihu').get(SettingEnum.isTitleImageFullScreen)
			},
			headers: {}
		})

		let resp = await sendRequest({
			uri: `${ZhuanlanAPI}/${articleId}/publish`,
			json: true,
			method: 'put',
			body: { "column": column, "commentPermission": "anyone" },
			headers: {},
			resolveWithFullResponse: true
		})
		if (resp.statusCode < 300) {
			this.promptSuccessMsg(`${ZhuanlanURL}${articleId}`, title)
		} else {
			vscode.window.showWarningMessage(`文章发布失败，错误代码${resp.statusCode}`)
		}
		return resp;
	}

	private promptSuccessMsg(url: string, title?: string) {
		vscode.window.showInformationMessage(`${title ? '"' + title + '"' : ''} 发布成功！\n`, { modal: true },
			previewActions.openInBrowser
		).then(r => r ? vscode.env.openExternal(vscode.Uri.parse(url)) : undefined);
	}

	shebangParser(text: string): URL {
		let shebangRegExp = /#[!！]\s*((https?:\/\/)?(.+))$/i
		let lf = text.indexOf('\n');
		if (lf < 0) lf = text.length;
		let link = text.slice(0, lf);
		if (!shebangRegExp.test(link)) return undefined;
		let url = new URL(link.replace(shebangRegExp, '$1'));
		if (/^(\w)+\.zhihu\.com$/.test(url.host)) return url;
		else return undefined;
		// shebangRegExp = /(https?:\/\/)/i
	}
}