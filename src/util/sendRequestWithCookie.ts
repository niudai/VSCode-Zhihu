import * as httpClient from "request-promise";
import { CaptchaAPI } from "../const/URL";
import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { DefaultHeader } from "../const/HTTP";
import { IFeedTarget } from "../model/target/target";

export async function sendRequestWithCookie(options, context: vscode.ExtensionContext): Promise<any> {


	var headers = DefaultHeader;

	headers['cookie'] = fs.readFileSync(path.join(context.extensionPath, 'cookie.txt'));

	options.headers = headers;

	var resp = await httpClient(options);

	// console.log(resp);

	return Promise.resolve(resp);

}