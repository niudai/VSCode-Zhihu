import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as httpClient from 'request';
import { HotStoryPage, HotStory } from './model/hot-story.model';

export interface StoryType {
	storyType?: string;
	ch?: string;
}

export const STORY_TYPES = [
	{ storyType: 'total', ch: '全站'},
	{ storyType: 'sport', ch: '运动'},
	{ storyType: 'science', ch: '科学'},
	{ storyType: 'fashion', ch: '时尚'},
	{ storyType: 'film', ch: '影视'},
	{ storyType: 'digital', ch: '数码'}
];

export class DepNodeProvider implements vscode.TreeDataProvider<Dependency> {

	private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined> = new vscode.EventEmitter<Dependency | undefined>();
	readonly onDidChangeTreeData: vscode.Event<Dependency | undefined> = this._onDidChangeTreeData.event;

	constructor() {
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: Dependency): vscode.TreeItem {
		return element;
	}

	getChildren(element?: Dependency): Thenable<Dependency[]> {

		if (element) {
			return new Promise((resolve, reject) => {
				let hotStoryAPI = `https://www.zhihu.com/api/v3/feed/topstory/hot-lists/${element.token}?desktop=true`;
				httpClient(hotStoryAPI, { json: true }, (err, _res, body) => {
					let questions: HotStory[] = body.data;
					questions.forEach(q => console.log(q));
					let deps: Dependency[] = questions.map(story => {
						return new Dependency(story.target.title, '', vscode.TreeItemCollapsibleState.None, 
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
			// const packageJsonPath = path.join(this.workspaceRoot, 'package.json');
			// if (this.pathExists(packageJsonPath)) {
			// 	return Promise.resolve(this.getDepsInPackageJson(packageJsonPath));
			// } else {
			// 	vscode.window.showInformationMessage('Workspace has no package.json');
			// 	return Promise.resolve([]);
			// }
			return Promise.resolve(this.getHotStoriesType());
		}

	}

	private getHotStoriesType(): Dependency[] {
		return STORY_TYPES.map(type => {
			return new Dependency(type.ch, type.storyType, vscode.TreeItemCollapsibleState.Collapsed);
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

export class Dependency extends vscode.TreeItem {

	constructor(
		public readonly label: string,
		public token: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command
	) {
		super(label, collapsibleState);
	}

	get tooltip(): string {
		return `${this.label}-${this.token}`;
	}

	get description(): string {
		return this.token;
	}

	// iconPath = {
	// 	light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
	// 	dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
	// };

	contextValue = 'dependency';

}
