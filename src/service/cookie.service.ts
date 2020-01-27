import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import * as cookieUtil from "tough-cookie";

export class CookieService {
	
	constructor(protected context: vscode.ExtensionContext,
		protected cookieJar: cookieUtil.CookieJar) {
	}
	/**
	 * getCookieString
	 */
	public getCookieString(currentUrl): string {
		return this.cookieJar.getCookieStringSync(currentUrl);
	}

	public putCookie(_cookies: string[], currentUrl: string) {
		_cookies.map(c => {
			return cookieUtil.Cookie.parse(c);
		}).forEach(c => {
			this.cookieJar.setCookieSync(c, currentUrl);
		});
	}

}