
import * as httpClient from "request-promise";
import { Cookie, CookieJar, Store } from "tough-cookie";
import { DefaultHTTPHeader } from "../const/HTTP";
import { ZhihuDomain } from "../const/URL";
import { getCookieJar, getCookieStore } from "../global/cookie";
import { Output } from "../global/logger";
import { IProfile } from "../model/target/target";

interface CacheItem {
	url: string,
	data: any
}


export class HttpService {
	public profile: IProfile;
	public xsrfToken: string;
	public cache = {};

	constructor() {
	}


	public async sendRequest(options): Promise<any> {

		if (options.headers == undefined) {
			options.headers = DefaultHTTPHeader;
			try {
				options.headers['cookie'] = getCookieJar().getCookieStringSync(options.uri);
			} catch (error) {
				console.log(error)
			}
		}
		if (this.xsrfToken) {
			options.headers['x-xsrftoken'] = this.xsrfToken;
		}
		options.headers['cookie'] = getCookieJar().getCookieStringSync(options.uri);
		// options.headers['cookie'] = getCookieJar().getCookieStringSync('www.zhihu.com');
		// headers['cookie'] = cookieService.getCookieString(options.uri);
		var returnBody;
		if (options.resolveWithFullResponse == undefined || options.resolveWithFullResponse == false) {
			returnBody = true;
		} else {
			returnBody = false;
		}
		options.resolveWithFullResponse = true;

		options.simple = false;

		var resp;
		if (!this.cache) this.cache = {}
		try {
			if (this.cache[options.uri]) {
				// cache hit
				resp = this.cache[options.uri]
			} else {
				// cache miss
				resp = await httpClient(options);
				if (resp.headers['set-cookie']) {
					resp.headers['set-cookie'].map(c => Cookie.parse(c))
						.forEach(c => {
							// delete c.domain
							getCookieJar().setCookieSync(c, options.uri)
							getCookieStore().findCookie(ZhihuDomain, '/', '_xsrf', (err, c) => {
								if(c) { this.xsrfToken = c.value }
							})
						});
				}
				if (options.enableCache) {
					this.cache[options.uri] = resp;
				}	
			}
		} catch (error) {
			// vscode.window.showInformationMessage('请求错误');
			Output(error);
			return Promise.resolve(null);
		}
		if (returnBody) {
			return Promise.resolve(resp.body)
		} else {
			return Promise.resolve(resp);
		}

	}

	public clearCookie(domain?: string) {
		if (domain == undefined) {
			getCookieStore().removeCookies(ZhihuDomain, null, err => console.log(err));
		}
		this.xsrfToken = undefined;
	}

	public clearCache() {
		this.cache = {}
	}
}

var httpService = new HttpService()

export const sendRequest = httpService.sendRequest;
export const clearCookie = httpService.clearCookie;
export const clearCache = httpService.clearCache;
