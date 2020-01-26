import { ISearchItem, ISearchResults } from "../model/search-results";
import * as httpClient from 'request-promise';
import * as https from 'https';

const ZHIHU_SEARCH_API: string = "https://www.zhihu.com/api/v4/search_v3";

export async function getSearchResults(keyword: string, searchType: string): Promise<ISearchItem[]> {

	const params = {
		t: searchType,
		q: keyword,
		offset: '0',
		limit: '10'
	};
	const result = await httpClient(`${ZHIHU_SEARCH_API}?${toQueryString(params)}`);
	const jsonResult: ISearchResults = JSON.parse(result);
	return Promise.resolve(jsonResult.data.filter(o => o.type == 'search_result'));

}

function toQueryString(params: { [key: string]: any }): string {
	return Object.keys(params).map(k => `${k}=${encodeURIComponent(params[k].toString())}`).join('&');
}