import * as httpClient from 'request';
import * as vscode from 'vscode';
import { HotStory } from '../model/hot-story.model';
import { IStoryTarget } from '../model/target/target';
import { HotStoryAPI } from '../const/URL';

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
				let hotStoryAPI = `${HotStoryAPI}/${element.type}?desktop=true`;
				httpClient(hotStoryAPI, { json: true }, (err, _res, body) => {
					let questions: HotStory[] = body.data;
					let deps: ZhihuTreeItem[] = questions.map(story => {
						return new ZhihuTreeItem(story && story.target && story.target.title ? story.target.title : '', '', vscode.TreeItemCollapsibleState.None, 
						{
							command: 'zhihu.openWebView',
							title: 'openWebView',
							arguments: [story.target]
						}, story.target); 
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

export class LinkableTreeItem extends vscode.TreeItem {
	constructor(
		public readonly label: string, 
		public collapsibleState: vscode.TreeItemCollapsibleState,
		public link: string | undefined
		) { super(label, collapsibleState) }
}

export class ZhihuTreeItem extends LinkableTreeItem  {

	constructor(
		public readonly label: string,
		public type: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command,
		public target?: IStoryTarget,
		public page?: number,
	) {
		super(label, collapsibleState, target && target.url ? target.url : '');
	}

	get tooltip(): string {
		return this.target && this.target.excerpt ? this.target.excerpt : '';
	}

	get description(): string {
		return this.target && this.target.excerpt ? this.target.excerpt : '';
	}

	// iconPath = {
	// 	light: vscode.ThemeIcon.File,
	// 	dark: vscode.ThemeIcon.File
	// };

	contextValue =  (this.type == 'feed') ? 'feed' : 'dependency';

}
