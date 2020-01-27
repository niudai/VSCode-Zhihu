
import { compileFile } from "pug";
import * as vscode from "vscode";

export interface IWebviewPugRender {
	viewType: string,
	title: string,
	showOptions: vscode.ViewColumn,
	options?: vscode.WebviewOptions & vscode.WebviewPanelOptions,
	pugTemplatePath: string,
	pugObjects?: any,
	iconPath: any
}

export class WebviewService {

	constructor (protected context: vscode.ExtensionContext) {
	}

	/**
	 * Create and show a webview provided by pug
	 */
	public 	renderHtml(w: IWebviewPugRender) {
		const panel = vscode.window.createWebviewPanel(
			w.viewType,
			w.title,
			w.showOptions,
			w.options
		);
		const compiledFunction = compileFile(
			w.pugTemplatePath
		);
		panel.iconPath = vscode.Uri.file(w.iconPath);
		panel.webview.html = compiledFunction(w.pugObjects);
	}
}