import * as vscode from "vscode";
import { ISearchItem, ISearchResults } from "../model/search-results";
import { WebviewService } from "./webview.service";
import { removeHtmlTag } from "../util/md-html-utils";
import { SearchTypes } from "../const/ENUM";
import { SearchAPI } from "../const/URL";
import axios from "axios";
import { getCookieJar } from "../global/cookie";
import { genXZse96 } from "../util/genXZse96";

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
            correction: "1",
            offset: "0",
            limit: "20",
            filter_fields: "",
			"lc_idx":"0",
            show_all_topics: "0",
            search_source: "Normal",
        };
		const cookie = getCookieJar().getCookieStringSync(SearchAPI);
		const api = `/api/v4/search_v3?t=${searchType}&q=${encodeURIComponent(keyword)}&correction=1&offset=0&limit=20&filter_fields=&lc_idx=0&show_all_topics=0&search_source=Normal`

        const result = await axios({
            url: `https://www.zhihu.com/api/v4/search_v3`,
			params,
			method: "GET",
			headers: {
				"x-zse-93": "101_3_2.0",
				"x-zse-96": genXZse96(api, cookie),
				cookie
			},
        });
		const jsonResult: ISearchResults = result.data;
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