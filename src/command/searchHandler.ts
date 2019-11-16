import * as vscode from "vscode";
import { ISearchItem } from "../model/search-results";
import * as search from '../service/search.service';
import { openQuestionHandler } from "./openQuestionHandler";

export async function searchHandler(context: vscode.ExtensionContext): Promise<void> {
	const keywordString: string | undefined = await vscode.window.showInputBox({
		ignoreFocusOut: true,
		prompt: "输入关键字, 搜索知乎内容",
		placeHolder: "",
	});
	if (!keywordString) {
		return;
	}
	const searchResults = await search.getSearchResults(keywordString);
	console.log(searchResults);
	const selectedItem: ISearchItem | undefined = await vscode.window.showQuickPick<vscode.QuickPickItem & { value: ISearchItem }>(
		searchResults.map(item => ({ value: item, label: `$(package) ${item.highlight.title}`, description: item.highlight.description})),
		{ placeHolder: "选择你想要的结果"}
	).then(vscodeItem => vscodeItem.value);
	
	console.log(`Selcted Item = ${selectedItem}`);

	openQuestionHandler(selectedItem.object.id, context);
	
}