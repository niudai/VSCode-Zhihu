
import * as vscode from "vscode";
import { SelfProfileAPI } from "../const/URL";
import { IProfile } from "../model/target/target";
import { HttpService } from "./http.service";

export class ProfileService {
	public profile: IProfile;

	constructor (protected context: vscode.ExtensionContext, 
		protected httpService: HttpService) {
	}

	public async fetchProfile() {
		this.profile  = await this.httpService.sendRequest({
			uri: SelfProfileAPI,
			json: true
		});
	}

	get name(): string {
		this.fetchProfile();
		return this.profile.name;
	}

	get headline(): string {
		return this.profile.headline;
	}

	get avatarUrl(): string {
		return this.profile.avatar_url;
	}
}