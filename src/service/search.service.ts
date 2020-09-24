import * as httpClient from "request-promise";
import * as vscode from "vscode";
import { ISearchItem, ISearchResults } from "../model/search-results";
import { WebviewService } from "./webview.service";
import { removeHtmlTag } from "../util/md-html-utils";
import { SearchTypes } from "../const/ENUM";
import { SearchAPI } from "../const/URL";


export const SearchDict = [
	{ value: SearchTypes.general, ch: '综合' },
	{ value: SearchTypes.question, ch: '问题' },
];

export class SearchService {
	constructor(
		protected webviewService: WebviewService) { }

	public async getSearchResults(keyword: string, searchType: string): Promise<ISearchItem[]> {
		const params = {
			t: searchType,
			q: keyword,
			offset: '0',
			limit: '10'
		};
		const result = await httpClient(`${SearchAPI}?${toQueryString(params)}`);
		const jsonResult: ISearchResults = JSON.parse(result);
		return Promise.resolve(jsonResult.data.filter(o => o.type == 'search_result'));
	}

	public async getSearchItems() {
		const selectedSearchType: string = await vscode.window.showQuickPick<vscode.QuickPickItem & { value: string }>(
			SearchDict.map(type => ({ value: type.value, label: type.ch, description: '' })),
			{ placeHolder: "你要搜什么?" }
		).then(item => item ? item.value : undefined);

		if (!selectedSearchType) return

		const keywordString: string | undefined = await vscode.window.showInputBox({
			ignoreFocusOut: true,
			prompt: "输入关键字, 搜索知乎内容",
			placeHolder: "",
		});
		if (!keywordString) return;
		const searchResults = await this.getSearchResults(keywordString, selectedSearchType);
		const selectedItem: ISearchItem | undefined = await vscode.window.showQuickPick<vscode.QuickPickItem & { value: ISearchItem }>(
			searchResults.map(item => ({ value: item, label: `${removeHtmlTag(item.highlight.title)}`, description: removeHtmlTag(item.highlight.description) })),
			{ placeHolder: "选择你想要的结果:" }
		).then(vscodeItem => vscodeItem ? vscodeItem.value : undefined);
		if (!selectedItem) return

		this.webviewService.openWebview(selectedItem.object);
	}
}


function toQueryString(params: { [key: string]: any }): string {
	return Object.keys(params).map(k => `${k}=${encodeURIComponent(params[k].toString())}`).join('&');
}