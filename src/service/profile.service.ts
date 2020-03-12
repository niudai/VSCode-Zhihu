
import * as vscode from "vscode";
import { SelfProfileAPI, ColumnAPI } from "../const/URL";
import { IProfile } from "../model/target/target";
import { HttpService } from "./http.service";
import { AccountService } from "./account.service";
import { IColumn } from "../model/publish/column.model";

export class ProfileService {
	public profile: IProfile;

	constructor(protected httpService: HttpService,
		protected accountService: AccountService) {
	}

	public async fetchProfile() {
		if (await this.accountService.isAuthenticated()) {
			this.profile = await this.httpService.sendRequest({
				uri: SelfProfileAPI,
				json: true
			});
		} else {
			this.profile = undefined;
		}
	}

	get name(): string {
		// this.fetchProfile();
		return this.profile ? this.profile.name : undefined;
	}

	get headline(): string {
		return this.profile ? this.profile.headline : undefined;
	}

	get avatarUrl(): string {
		return this.profile ? this.profile.avatar_url : undefined;
	}

	async getColumns(): Promise<IColumn[]> {
		if (this.profile) {
			return this.httpService.sendRequest({
				uri: ColumnAPI(this.profile.url_token),
				json: true,
				gzip: true,
				method: 'get'
			}).then(resp => {
				return resp.data.map(element => element.column);
			})
		} else {
			vscode.window.showWarningMessage('请先登录！');
			return Promise.resolve(null);
		}
	}
}