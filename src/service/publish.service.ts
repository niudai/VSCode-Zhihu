
import * as vscode from "vscode";
import { IProfile } from "../model/target/target";
import { HttpService } from "./http.service";
import MarkdownIt = require("markdown-it");
import { WebviewService } from "./webview.service";
import { join } from "path";
import { TemplatePath } from "../const/PATH";
import { AnswerAPI } from "../const/URL";


export class PublishService {
	public profile: IProfile;

	constructor (protected context: vscode.ExtensionContext, 
		protected httpService: HttpService,
		protected mdParser: MarkdownIt,
		protected webviewService: WebviewService
		) {
	}

	preview(textEdtior: vscode.TextEditor, edit: vscode.TextEditorEdit) {
		let text = textEdtior.document.getText();
		let html = this.mdParser.render(text);
		this.webviewService.renderHtml({
			title: '预览',
			pugTemplatePath: join(this.context.extensionPath, TemplatePath, 'pre-publish.pug'),
			pugObjects: {
				title: '答案预览',
				content: html
			}
		});
	}

	publish(textEdtior: vscode.TextEditor, edit: vscode.TextEditorEdit) {
		let text = textEdtior.document.getText();
		let html = this.mdParser.render(text);
		html.replace('\"', '\\\"');
		this.httpService.sendRequest({
			uri: `${AnswerAPI}/678356914`,
			method: 'put',
			body: {
				content: html,
				reward_setting: {"can_reward":false,"tagline":""},
			},
			json: true,
			resolveWithFullResponse: true,
			headers: {},
		}).then(resp => console.log(resp))
	}
}