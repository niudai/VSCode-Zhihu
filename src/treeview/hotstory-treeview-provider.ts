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
	{ storyType: 'total', ch: '全站' },
	{ storyType: 'sport', ch: '运动' },
	{ storyType: 'science', ch: '科学'},
	{ storyType: 'fashion', ch: '时尚'},
	{ storyType: 'film', ch: '影视'},
	{ storyType: 'digital', ch: '数码'}
];

export class HotStoryTreeViewProvider implements vscode.TreeDataProvider<ZhihuTreeItem> {

	private _onDidChangeTreeData: vscode.EventEmitter<ZhihuTreeItem | undefined> = new vscode.EventEmitter<ZhihuTreeItem | undefined>();
	readonly onDidChangeTreeData: vscode.Event<ZhihuTreeItem | undefined> = this._onDidChangeTreeData.event;

	constructor() {
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
				let hotStoryAPI = `https://www.zhihu.com/api/v3/feed/topstory/hot-lists/${element.type}?desktop=true`;
				httpClient(hotStoryAPI, { json: true }, (err, _res, body) => {
					let questions: HotStory[] = body.data;
					let deps: ZhihuTreeItem[] = questions.map(story => {
						return new ZhihuTreeItem(story.target.title, '', vscode.TreeItemCollapsibleState.None, 
						{
							command: 'zhihu.openWebView',
							title: 'openWebView',
							arguments: [story.target]
						}); 
					});
					resolve(deps);
				});
			});
		} else {
			return Promise.resolve(this.getHotStoriesType());
		}

	}

	private getHotStoriesType(): ZhihuTreeItem[] {
		return STORY_TYPES.map(type => {
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
		return `${this.label}-${this.type}`;
	}

	get description(): string {
		return this.type;
	}

	// iconPath = {
	// 	light: vscode.ThemeIcon.File,
	// 	dark: vscode.ThemeIcon.File
	// };

	contextValue =  (this.type == 'feed') ? 'feed' : 'dependency';

}
