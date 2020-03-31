
import * as httpClient from "request-promise";
import { Cookie, CookieJar, Store } from "tough-cookie";
import { DefaultHTTPHeader } from "../const/HTTP";
import { ZhihuDomain } from "../const/URL";
import { getCookieJar, getCookieStore } from "../global/cookie";
import { Output } from "../global/logger";
import { IProfile } from "../model/target/target";

export class HttpService {
	public profile: IProfile;
	public xsrfToken: string;

	constructor() {}


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
		try {
			resp = await httpClient(options);
			if (resp.headers['set-cookie']) {
				resp.headers['set-cookie'].map(c => Cookie.parse(c))
					.forEach(c => {
						getCookieJar().setCookieSync(c, options.uri)
						getCookieStore().findCookie(ZhihuDomain, '/', '_xsrf', (err, c) => {
							this.xsrfToken = c.value
						})
					});
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
	}
}

var httpService = new HttpService()

export const sendRequest = httpService.sendRequest;
export const clearCookie = httpService.clearCookie;