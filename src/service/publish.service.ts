
import * as vscode from "vscode";
import { IProfile } from "../model/target/target";
import { HttpService } from "./http.service";
import MarkdownIt = require("markdown-it");


export class PublishService {
	public profile: IProfile;

	constructor (protected context: vscode.ExtensionContext, 
		protected httpService: HttpService,
		protected mdParser: MarkdownIt
		) {
	}

	publish(textEdtior: vscode.TextEditor, edit: vscode.TextEditorEdit) {
		let text = textEdtior.document.getText();
		vscode.window.showInformationMessage(text);
		let html = this.mdParser.render(text);
		let panel = vscode.window.createWebviewPanel('zhihu', 'preview', vscode.ViewColumn.One);
		panel.webview.html = html;
	}

}