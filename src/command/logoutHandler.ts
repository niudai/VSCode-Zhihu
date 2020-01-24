import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

export async function logoutHandler(context: vscode.ExtensionContext): Promise<void> {

	try {
		fs.writeFileSync(path.join(context.extensionPath, 'cookie.txt'), '');
	} catch(error) {
		console.log(error);
	}
	vscode.window.showInformationMessage('注销成功！');
}