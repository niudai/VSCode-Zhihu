
import * as vscode from "vscode";
import { SelfProfileAPI, SignUpRedirectPage } from "../const/URL";
import { sendRequestWithCookie } from "../util/sendRequestWithCookie";
import { IProfile } from "../model/target/target";


export class AccountService {
	public profile: IProfile;

	constructor (protected context: vscode.ExtensionContext) {
	}

	async fetchProfile() {
		this.profile  = await sendRequestWithCookie({
			uri: SelfProfileAPI,
			json: true
		}, this.context);
	}

	async isAuthenticated(): Promise<boolean> {

		let checkIfSignedIn;
		try {
			checkIfSignedIn = await sendRequestWithCookie({
				uri: SignUpRedirectPage,
				followRedirect: false,
				followAllRedirects: false,
				resolveWithFullResponse: true,
				gzip: true,
				simple: false
			}, this.context);
		} catch (err) {
			console.error('Http error', err);
			return false;
		}
		return Promise.resolve(checkIfSignedIn.statusCode == '302');
	}

}