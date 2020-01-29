
import * as vscode from "vscode";
import { IProfile } from "../model/target/target";
import { HttpService } from "./http.service";
import MarkdownIt = require("markdown-it");
import { WebviewService } from "./webview.service";
import { join } from "path";
import { TemplatePath } from "../const/PATH";


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
		vscode.window.showInformationMessage(text);
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

}