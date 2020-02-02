import * as vscode from 'vscode';
import { FeedStoryAPI } from '../const/URL';
import { AccountService } from '../service/account.service';
import { HttpService } from '../service/http.service';
import { ProfileService } from '../service/profile.service';
import { IFeedTarget, IQuestionAnswerTarget, IArticleTarget } from '../model/target/target';

export interface StoryType {
	storyType?: string;
	ch?: string;
}

export const STORY_TYPES = [
	{ storyType: 'feed', ch: '推荐' },
];

export class FeedTreeViewProvider implements vscode.TreeDataProvider<FeedTreeItem> {

	private _onDidChangeTreeData: vscode.EventEmitter<FeedTreeItem | undefined> = new vscode.EventEmitter<FeedTreeItem | undefined>();
	readonly onDidChangeTreeData: vscode.Event<FeedTreeItem | undefined> = this._onDidChangeTreeData.event;

	constructor(private context: vscode.ExtensionContext, 
		private accountService: AccountService,
		private profileService: ProfileService,
		private httpService: HttpService) {
	}

	refresh(node?: FeedTreeItem): void {
		this._onDidChangeTreeData.fire(node);
	}

	getTreeItem(element: FeedTreeItem): vscode.TreeItem {
		return element;
	}

	getChildren(element?: FeedTreeItem): Thenable<FeedTreeItem[]> {

		if (element) {
			return new Promise(async (resolve, reject) => {
				if (element.type == 'feed') {
					if (! await this.accountService.isAuthenticated()) {
						return resolve([new FeedTreeItem('(请先登录，查看个性内容)', '', vscode.TreeItemCollapsibleState.None)]);
					} 
					let feedAPI = `${FeedStoryAPI}?page_number=${element.page}&limit=10&action=down`;
					let feedResp = await this.httpService.sendRequest(
						{
							uri: feedAPI,
							json: true,
							gzip: true
						});
					feedResp = feedResp.data.filter(f => { return f.target.type != 'feed_advert';});
					let deps: FeedTreeItem[] = feedResp.map(feed => {
						let type = feed.target.type;
						if(type == 'article') {
							return new FeedTreeItem(feed.target.title, feed.target.type, vscode.TreeItemCollapsibleState.None, {
								command: 'zhihu.openWebView',
								title: 'openWebView',
								arguments: [feed.target]
							}, feed.target);
						} else if (type == 'answer') {
							return new FeedTreeItem(feed.target.question.title, feed.target.type, vscode.TreeItemCollapsibleState.None, {
								command: 'zhihu.openWebView',
								title: 'openWebView',
								arguments: [feed.target.question]
							}, feed.target);
						} else {
							return new FeedTreeItem('', '', vscode.TreeItemCollapsibleState.None);
						}
					});
					resolve(deps);

				}
			});
		} else {
			return Promise.resolve(this.getHotStoriesType());
		}

	}

	private async getHotStoriesType(): Promise<FeedTreeItem[]> {
		await this.profileService.fetchProfile();
		return Promise.resolve(STORY_TYPES.map(type => {
			return new FeedTreeItem(`${this.profileService.name} - ${this.profileService.headline}`, type.storyType, vscode.TreeItemCollapsibleState.Expanded, null, undefined, 0);
		}));
	}

}

export class FeedTreeItem extends vscode.TreeItem {

	constructor(
		public readonly label: string,
		public type: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command,
		public readonly target?: IQuestionAnswerTarget | IArticleTarget,
		public page?: number,
	) {
		super(label, collapsibleState);
	}

	get tooltip(): string {
		return `${this.label}`;
	}

	get description(): string {
		return this.target.excerpt;
	}

	// iconPath = {
	// 	light: vscode.ThemeIcon.File,
	// 	dark: vscode.ThemeIcon.File
	// };

	contextValue =  (this.type == 'feed') ? 'feed' : 'dependency';

}
