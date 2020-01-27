
import * as vscode from "vscode";
import { IProfile } from "../model/target/target";
import { DefaultHTTPHeader } from "../const/HTTP";
import * as fs from "fs";
import * as path from "path";
import * as httpClient from "request-promise";

export class HttpService {
	public profile: IProfile;

	constructor (protected context: vscode.ExtensionContext) {
	}
	
	public async sendRequest(options): Promise<any> {
	
		var headers = DefaultHTTPHeader;
	
		try {
			headers['cookie'] = fs.readFileSync(path.join(this.context.extensionPath, 'cookie.txt'), 'utf8');
		} catch(error) {
			fs.writeFileSync(path.join(this.context.extensionPath, 'cookie.txt'), '');
		}
	
		// headers['cookie'] = cookieService.getCookieString(options.uri);
	
		var returnBody;
		if (options.resolveWithFullResponse == undefined || options.resolveWithFullResponse == false) {
			returnBody = true;
		} else {
			returnBody = false;
		}
		options.resolveWithFullResponse = true;
	
		options.headers = headers;
		options.simple = false;
	
		try {
			var resp = httpClient(options);	
		} catch (error) {
			vscode.window.showInformationMessage('请求错误');
			return Promise.resolve(null);
		}
		if (returnBody) {
			return httpClient(options).then(resp => { return Promise.resolve(resp.body) })
		} else {
			return httpClient(options).then(resp => { return Promise.resolve(resp)});
		}
	
	}

}