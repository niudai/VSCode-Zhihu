
import * as vscode from "vscode";
import { SelfProfileAPI, SignUpRedirectPage } from "../const/URL";
import { IProfile } from "../model/target/target";
import { HttpService, sendRequest } from "./http.service";


export class AccountService {
	public profile: IProfile;

	constructor () {}

	async fetchProfile() {
		this.profile  = await sendRequest({
			uri: SelfProfileAPI,
			json: true
		});
	}

	async isAuthenticated(): Promise<boolean> {

		let checkIfSignedIn;
		try {
			checkIfSignedIn = await sendRequest({
				uri: SignUpRedirectPage,
				followRedirect: false,
				followAllRedirects: false,
				resolveWithFullResponse: true,
				gzip: true,
				simple: false
			});
		} catch (err) {
			console.error('Http error', err);
			return false;
		}
		return Promise.resolve(checkIfSignedIn ? checkIfSignedIn.statusCode == '302' : false);
	}

}