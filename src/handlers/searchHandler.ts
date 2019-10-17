import * as vscode from "vscode";


export async function searchHandler(): Promise<void> {
	const keywordString: string | undefined = await vscode.window.showInputBox({
		ignoreFocusOut: true,
		prompt: "输入关键字, 搜索知乎内容",
		placeHolder: "",
	});
	if (!keywordString) {
		return;
	}

	const selectedItem: IA
}