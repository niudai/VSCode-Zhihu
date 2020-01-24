
import * as vscode from "vscode";
import { SelfProfileAPI } from "../const/URL";
import { sendRequestWithCookie } from "../util/sendRequestWithCookie";
import { IProfile } from "../model/target/target";


export class ProfileService {
	public profile: IProfile;

	constructor (protected context: vscode.ExtensionContext) {
	}

	async fetchProfile() {
		this.profile  = await sendRequestWithCookie({
			uri: SelfProfileAPI,
			json: true
		}, this.context);
		console.log(this.profile);
	}

	get	name(): string {
		return this.profile.name;
	}

	get headline(): string {
		return this.profile.headline;
	}

	get avatarUrl(): string {
		return this.profile.avatar_url;
	}
}