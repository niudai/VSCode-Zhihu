import * as vscode from "vscode";
import { ISearchItem } from "../model/search-results";
import * as search from '../service/search.service';
import { openWebviewHandler } from "./openWebviewHandler";
import { SearchTypes } from "../util/searchTypesEnum";

export async function searchHandler(context: vscode.ExtensionContext): Promise<void> {

	const selectedSearchType: string = await vscode.window.showQuickPick<vscode.QuickPickItem & { value: string }> (
		SearchTypes.map(type => ({ value: type.value, label: type.ch, description: '' })),
			{ placeHolder: "你要搜什么?"}
	).then(item => item.value);

	const keywordString: string | undefined = await vscode.window.showInputBox({
		ignoreFocusOut: true,
		prompt: "输入关键字, 搜索知乎内容",
		placeHolder: "",
	});
	if (!keywordString) {
		return;
	}
	const searchResults = await search.getSearchResults(keywordString, selectedSearchType);
	console.log(searchResults);
	const selectedItem: ISearchItem | undefined = await vscode.window.showQuickPick<vscode.QuickPickItem & { value: ISearchItem }>(
		searchResults.map(item => ({ value: item, label: `$(package) ${item.highlight.title}`, description: item.highlight.description})),
		{ placeHolder: "选择你想要的结果:"}
	).then(vscodeItem => vscodeItem.value);
	
	console.log(`Selcted Item = ${selectedItem}`);

	openWebviewHandler(selectedItem.object, context);
	
}