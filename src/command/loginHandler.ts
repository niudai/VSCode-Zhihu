import * as vscode from "vscode";
import { ISearchItem } from "../model/search-results";
import * as search from '../service/search.service';
import { openWebviewHandler } from "./openWebviewHandler";
import { SearchTypes } from "../util/searchTypesEnum";

export async function loginHandler(context: vscode.ExtensionContext): Promise<void> {

	const phoneNumber: string | undefined = await vscode.window.showInputBox({
		ignoreFocusOut: true,
		prompt: "输入手机号或邮箱",
		placeHolder: "",
	});
	if (!phoneNumber) {
		return;
	}
	const password: string | undefined = await vscode.window.showInputBox({
		ignoreFocusOut: true,
		prompt: "输入密码",
		placeHolder: "",
		password: true
	});
	vscode.window.showInformationMessage('登录成功!');	
}