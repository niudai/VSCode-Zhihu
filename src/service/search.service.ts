import { ISearchItem, ISearchResults } from "../model/search-results";
import * as httpClient from 'request-promise';
import * as https from 'https';

const ZHIHU_SEARCH_API: string = "https://www.zhihu.com/api/v4/search_v3";

export async function getSearchResults(keyword: string): Promise<ISearchItem[]> {

	const params = {
		t: 'general',
		q: keyword,
		offset: '0',
		limit: '10'
	};
	const result = await httpClient(`${ZHIHU_SEARCH_API}?${toQueryString(params)}`);
	console.log(`Get Search Result: ${result}`);
	const jsonResult: ISearchResults = JSON.parse(result);
	return Promise.resolve(jsonResult.data);

}

function toQueryString(params: { [key: string]: any }): string {
	return Object.keys(params).map(k => `${k}=${encodeURIComponent(params[k].toString())}`).join('&');
}