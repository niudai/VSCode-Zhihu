import * as httpClient from "request-promise";
import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { DefaultHeader } from "../const/HTTP";

export async function sendRequestWithCookie(options, context: vscode.ExtensionContext): Promise<any> {

	console.log('Sending Request With Cookie...');
	var headers = DefaultHeader;

	try {
		headers['cookie'] = fs.readFileSync(path.join(context.extensionPath, 'cookie.txt'), 'utf8');
	} catch(error) {
		fs.writeFileSync(path.join(context.extensionPath, 'cookie.txt'), '');
	}

	options.headers = headers;
	options.simple = false;

	try {
		var resp = await httpClient(options);	
	} catch (error) {
		vscode.window.showInformationMessage('请求错误');
		console.log(error);
	}

	return Promise.resolve(resp);

}