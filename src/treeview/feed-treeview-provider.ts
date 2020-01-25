import * as fs from 'fs';
import * as httpClient from 'request';
import * as vscode from 'vscode';
import { FeedStoryAPI } from '../const/URL';
import { sendRequestWithCookie } from '../util/sendRequestWithCookie';
import { HotStory } from '../model/hot-story.model';
import { AccountService } from '../service/account.service';
import { ProfileService } from '../service/profile.service';

export interface StoryType {
	storyType?: string;
	ch?: string;
}

export const STORY_TYPES = [
	{ storyType: 'feed', ch: '推荐' },
];

export class FeedTreeViewProvider implements vscode.TreeDataProvider<ZhihuTreeItem> {

	private _onDidChangeTreeData: vscode.EventEmitter<ZhihuTreeItem | undefined> = new vscode.EventEmitter<ZhihuTreeItem | undefined>();
	readonly onDidChangeTreeData: vscode.Event<ZhihuTreeItem | undefined> = this._onDidChangeTreeData.event;

	constructor(private context: vscode.ExtensionContext, 
		private accountService: AccountService,
		private profileService: ProfileService) {
	}

	refresh(node?: ZhihuTreeItem): void {
		this._onDidChangeTreeData.fire(node);
	}

	getTreeItem(element: ZhihuTreeItem): vscode.TreeItem {
		return element;
	}

	getChildren(element?: ZhihuTreeItem): Thenable<ZhihuTreeItem[]> {

		if (element) {
			return new Promise(async (resolve, reject) => {
				if (element.type == 'feed') {
					if (! await this.accountService.isAuthenticated()) {
						return resolve([new ZhihuTreeItem('(请先登录，查看个性内容)', '', vscode.TreeItemCollapsibleState.None)]);
					} 
					let feedAPI = `${FeedStoryAPI}?page_number=${element.page}&limit=10&action=down`;
					let feedResp = await sendRequestWithCookie(
						{
							uri: feedAPI,
							json: true,
							gzip: true
						}
						, this.context);
					feedResp = feedResp.data.filter(f => { return f.target.type != 'feed_advert';});
					let deps: ZhihuTreeItem[] = feedResp.map(feed => {
						let type = feed.target.type;
						if(type == 'article') {
							return new ZhihuTreeItem(feed.target.title, feed.target.type, vscode.TreeItemCollapsibleState.None, {
								command: 'zhihu.openWebView',
								title: 'openWebView',
								arguments: [feed.target]
							});
						} else if (type == 'answer') {
							return new ZhihuTreeItem(feed.target.question.title, feed.target.type, vscode.TreeItemCollapsibleState.None, {
								command: 'zhihu.openWebView',
								title: 'openWebView',
								arguments: [feed.target.question]
							});
						} else {
							return new ZhihuTreeItem('', '', vscode.TreeItemCollapsibleState.None);
						}
					});
					resolve(deps);

				}
			});
		} else {
			return Promise.resolve(this.getHotStoriesType());
		}

	}

	private getHotStoriesType(): ZhihuTreeItem[] {
		return STORY_TYPES.map(type => {
			if (type.storyType == 'feed') {
				return new ZhihuTreeItem(`${this.profileService.name} - ${this.profileService.headline}`, type.storyType, vscode.TreeItemCollapsibleState.Expanded, null, 0);
			}
			return new ZhihuTreeItem(type.ch, type.storyType, vscode.TreeItemCollapsibleState.Collapsed);
		});
	}

}

export class ZhihuTreeItem extends vscode.TreeItem {

	constructor(
		public readonly label: string,
		public type: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command,
		public page?: number,
	) {
		super(label, collapsibleState);
	}

	get tooltip(): string {
		return `${this.label}`;
	}

	get description(): boolean {
		return false;
	}

	// iconPath = {
	// 	light: vscode.ThemeIcon.File,
	// 	dark: vscode.ThemeIcon.File
	// };

	contextValue =  (this.type == 'feed') ? 'feed' : 'dependency';

}
