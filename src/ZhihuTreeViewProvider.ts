import * as fs from 'fs';
import * as httpClient from 'request';
import * as vscode from 'vscode';
import { FeedStoryAPI } from './const/URL';
import { sendRequestWithCookie } from './util/sendRequestWithCookie';
import { HotStory } from './model/hot-story.model';

export interface StoryType {
	storyType?: string;
	ch?: string;
}

export const STORY_TYPES = [
	{ storyType: 'feed', ch: '推荐' },
	{ storyType: 'total', ch: '全站' },
	{ storyType: 'sport', ch: '运动' },
	{ storyType: 'science', ch: '科学'},
	{ storyType: 'fashion', ch: '时尚'},
	{ storyType: 'film', ch: '影视'},
	{ storyType: 'digital', ch: '数码'}
];

export class ZhihuTreeViewProvider implements vscode.TreeDataProvider<ZhihuTreeItem> {

	private _onDidChangeTreeData: vscode.EventEmitter<ZhihuTreeItem | undefined> = new vscode.EventEmitter<ZhihuTreeItem | undefined>();
	readonly onDidChangeTreeData: vscode.Event<ZhihuTreeItem | undefined> = this._onDidChangeTreeData.event;

	constructor(private context: vscode.ExtensionContext) {
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
					let feedAPI = `${FeedStoryAPI}?page_number=${element.page}&limit=10&action=down`;
					let feedResp = await sendRequestWithCookie(
						{
							uri: feedAPI,
							json: true,
							gzip: true
						}
						, this.context);
					// feedResp.forEach(f => console.log(f));
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
				let hotStoryAPI = `https://www.zhihu.com/api/v3/feed/topstory/hot-lists/${element.type}?desktop=true`;
				httpClient(hotStoryAPI, { json: true }, (err, _res, body) => {
					let questions: HotStory[] = body.data;
					questions.forEach(q => console.log(q));
					let deps: ZhihuTreeItem[] = questions.map(story => {
						return new ZhihuTreeItem(story.target.title, '', vscode.TreeItemCollapsibleState.None, 
						{
							command: 'zhihu.openWebView',
							title: 'openWebView',
							arguments: [story.target]
						}); 
						// return new Dependency('apple', 'no', vscode.TreeItemCollapsibleState.None);
					});
					// console.log(`${deps} + ${element.token}`);
					console.log(`questions`);
					resolve(deps);
				});
			});
			// return Promise.resolve([new Dependency('测试', '好', vscode.TreeItemCollapsibleState.None)]);
		} else {
			// root element is null
			return Promise.resolve(this.getHotStoriesType());
		}

	}

	private getHotStoriesType(): ZhihuTreeItem[] {
		return STORY_TYPES.map(type => {
			if (type.storyType == 'feed') {
				return new ZhihuTreeItem(type.ch, type.storyType, vscode.TreeItemCollapsibleState.Expanded, null, 0);
			}
			return new ZhihuTreeItem(type.ch, type.storyType, vscode.TreeItemCollapsibleState.Collapsed);
		});
	}

	// private getHotStories(storyType: StoryType): Dependency[] {
	// 	let hotStoryAPI = `https://www.zhihu.com/api/v3/feed/topstory/hot-lists/${storyType.storyType}?desktop=true`;
	// 	let hotQuestions;
	// 	httpClient(hotStoryAPI, { json: true }, (err, _res, body) => {
	// 		let questions = body.data;
	// 		hotQuestions = questions.map(story => {
	// 			new Dependency(story.target.title, 'v4', vscode.TreeItemCollapsibleState.None);
	// 		});
	// 	});
	// }

	private pathExists(p: string): boolean {
		try {
			fs.accessSync(p);
		} catch (err) {
			return false;
		}

		return true;
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
