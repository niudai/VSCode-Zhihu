import * as vscode from "vscode";
import { ISearchItem, ISearchResults } from "../model/search-results";
import { WebviewService } from "./webview.service";
import { removeHtmlTag } from "../util/md-html-utils";
import { SearchTypes } from "../const/ENUM";
import { SearchAPI } from "../const/URL";
import axios from "axios";
import { getCookieJar } from "../global/cookie";
import { b } from '../util/g_encrypt'
import * as md5 from 'md5';
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
		const str = `101_3_2.0+/api/v4/search_v3?t=${searchType}&q=${keyword}&correction=1&offset=0&limit=20&filter_fields=&lc_idx=0&show_all_topics=0&search_source=Normal+"AKCftBUl9BOPTrRxAbXw2tHou6s3tz8zIns=|1635581798"`
		const data = md5(str);
		const x_zse_96 = "2.0_" + b(data)
		const cookie = getCookieJar().getCookieStringSync(SearchAPI);
        const result = await axios({
            url: `https://www.zhihu.com/api/v4/search_v3`,
			params,
			method: "GET",
			headers: {
				"x-zse-93": "101_3_2.0",
				// "x-zse-96": "2.0_a0N8gULqo_xYkH2qzBN8b0986TNY68O81TxBFgr0Nw2f",
				"x-zse-96": x_zse_96,
				cookie: '_zap=392b5aa3-98cf-4f9c-85a2-6891062a45d1; d_c0="AKCftBUl9BOPTrRxAbXw2tHou6s3tz8zIns=|1635581798"; captcha_session_v2="2|1:0|10:1635581800|18:captcha_session_v2|88:NVJXY1htTWNEZjJFSlZWMDQrbHNCanpCVWxEcUlUeUZucDB1NENLdmpVQWo1dStIZHFieUxxMTloZm5qaDVQUQ==|a1eabb0337e17fffb10608154d24d1db9e45ca97119dbc75621f55b18da81bd0"; __snaker__id=RNzTLBYz1vUJ8agD; _9755xjdesxxd_=32; gdxidpyhxdE=SOQTnDTzpC9zLTjScaEVa3feAM28Q%2FZsopp7OukGYXCqL%2F5e1xquRq%2BgoIYY060S2Tr8TyMEW34jAf5VPDUMBTb5G6oMfINmri%5CIjX7no6YultZb%2BQSJJf54MXIphwbCnz%2BGrGhyH%5CoPQBRoqkzoiB%2BaZS9gJHWCC9iO5OtrK82CXfK%2F%3A1635582704736; YD00517437729195%3AWM_NI=qa7Ax39Pvd5VzmXmFDoEigOfkAHvLNCA7yjxUM9rJxBsEHApI7OCfQAPPHafyI5T3aKFlfn%2BGEjgfyOZ4DeapoN6Mx1M6VoCvD6KAMQ1CWOJDmOqLtZS1H3Wvf4a014acUc%3D; YD00517437729195%3AWM_NIKE=9ca17ae2e6ffcda170e2e6eed5d54582938fb1c97a928a8fa7d85f979b9baef58089bd8baecb45a598a7a4ef2af0fea7c3b92ab3bff9a2fb39fb90ba85b85ebab3988ec550ad9ba788ce6ea99f8897cf46819ff99ae9749793f793c97482ad8ba9c47c8be981a4e55b8390a0a9e46ebb97fbb5b26b899aa487ed21859ba688e5738d86fca5e86bb4b182d7d074f393fab7ee49b69cfaacc44793ef8db8ce4288b38192cf809a8dffa9b25db6bafc82b33bf8bfadb6e237e2a3; YD00517437729195%3AWM_TID=wO9jpjWNZK5EEREUFRZq8aIQIGOlHnTw; captcha_ticket_v2="2|1:0|10:1635581807|17:captcha_ticket_v2|704:eyJ2YWxpZGF0ZSI6IkNOMzFfZU5nLTc4VjZsUmQwTEZ3WC1HZFZWd2lJbjVvLlZ5Qk9YaWs4Qm1GelhyNVRKbmkyQ2xyRUpQcE9RbmR3LW1ORVpGc1FMSExPYTBLdXhlbXZ0TG9sdXBWWHBfNnVOdUF1eDhVd2JUZUV6N3RlcGJLNE5kYjlUNy41blJwYU91T2sxVTYwYUFmN2d0YmQtd3FwaUZUQS1hZS5qczZmbmh2bGFwZDB4MVFQUU9fbDBWZmlkRzB6c1VmQXhCOUpWODFHMHdSUFN2clJKSlNmTi5HaC1FMUIwejhFcU9iZXBZdVNpRVVHLmV5RG5Ea3JYaVl6R0MuY01tSEJ2aWhvSjJZZG51OEZEcnhiVHF5LTVmdHppeS5PLWo1YU5XNzVyYkJGUG9WWVh6bUdXVXJsYXFSLlVWWEVad3dyZEkxTE42eHV5TUkuQkZXT0lVNjFRblVDSFVKVnl0bmgtbHBfdEouYm1pVmJGdkpOMUNJS1BBU2VsanprMnRPWEpsZlZ1UnRBbnJrZ2R3ZzdWeHEwRm91QmowYWZOcjdDT0QyRENnd3FadldkdWJYQXJHeTh4R1ROSk90UGE3eE5mX1hFNHVKN2l1TUZaN3ZBYXptVm9kSXBpSXk2blEwUUF0bkc5enUyZ0FOeW9SWDh3dTRReWlTc0N0YlJJNW9IWEJxMyJ9|42c5adcdce8a0c06739815c9ec5942e90a2972aec416b5bad55f4d550c681f60"; z_c0="2|1:0|10:1635581807|4:z_c0|92:Mi4xOEZVUUJnQUFBQUFBb0otMEZTWDBFeVlBQUFCZ0FsVk5iMDFxWWdBSWJpaFhqOTN2Q3RRZXZpdVRBTC1lV2NFMm5n|1a503be705ed35196e0d0b3b168f17f74be619a13f94c8f65450ea283c2fb4f2"; q_c1=9a9b60838bff40e7a313f3ad00ccb8ae|1635581807000|1635581807000; _xsrf=snoNuzoYQWRo0ywfhRN0DNbyT3jUDal3; ff_supports_webp=1; NOT_UNREGISTER_WAITING=1; tst=f; SESSIONID=2N7G2pjw1mT5RKON4FwJBAfC333mhxren2yYisKiD4L; KLBRSID=e42bab774ac0012482937540873c03cf|1637769636|1637764308',
				// cookie
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