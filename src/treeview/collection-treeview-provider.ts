import * as vscode from 'vscode';
import { MediaTypes } from '../const/ENUM';
import { AccountService } from '../service/account.service';
import { CollectionService } from '../service/collection.service';
import { HttpService } from '../service/http.service';
import { ProfileService } from '../service/profile.service';

export interface CollectType {
	type?: string;
	ch?: string;
}

export const COLLECT_TYPES = [
	{ type: MediaTypes.answer, ch: '答案' },
	{ type: MediaTypes.article, ch: '文章' },
	{ type: MediaTypes.question, ch: '问题' }
];

export class CollectionTreeviewProvider implements vscode.TreeDataProvider<CollectionItem> {

	private _onDidChangeTreeData: vscode.EventEmitter<CollectionItem | undefined> = new vscode.EventEmitter<CollectionItem | undefined>();
	readonly onDidChangeTreeData: vscode.Event<CollectionItem | undefined> = this._onDidChangeTreeData.event;

	constructor(private context: vscode.ExtensionContext, 
		private profileService: ProfileService,
		private collectionService: CollectionService) {
	}

	refresh(node?: CollectionItem): void {
		this._onDidChangeTreeData.fire(node);
	}

	getTreeItem(element: CollectionItem): vscode.TreeItem {
		return element;
	}

	getChildren(element?: CollectionItem): Thenable<CollectionItem[]> {

		if (element) {
			return new Promise(async (resolve, reject) => {
				let targets = await this.collectionService.getTargets();
				resolve(targets.map(t => {
					return new CollectionItem(t.title, t.type, vscode.TreeItemCollapsibleState.None, {
						command: 'zhihu.openWebView',
						title: 'openWebView',
						arguments: [t]
					});
				}))
				// if (element.type == 'feed') {
				// 	if (! await this.accountService.isAuthenticated()) {
				// 		return resolve([new ZhihuTreeItem('(请先登录，查看个性内容)', '', vscode.TreeItemCollapsibleState.None)]);
				// 	} 
				// 	let feedAPI = `${FeedStoryAPI}?page_number=${element.page}&limit=10&action=down`;
				// 	let feedResp = await this.httpService.sendRequest(
				// 		{
				// 			uri: feedAPI,
				// 			json: true,
				// 			gzip: true
				// 		});
				// 	feedResp = feedResp.data.filter(f => { return f.target.type != 'feed_advert';});
				// 	let deps: ZhihuTreeItem[] = feedResp.map(feed => {
				// 		let type = feed.target.type;
				// 		if(type == 'article') {
				// 			return new ZhihuTreeItem(feed.target.title, feed.target.type, vscode.TreeItemCollapsibleState.None, {
				// 				command: 'zhihu.openWebView',
				// 				title: 'openWebView',
				// 				arguments: [feed.target]
				// 			});
				// 		} else if (type == 'answer') {
				// 			return new ZhihuTreeItem(feed.target.question.title, feed.target.type, vscode.TreeItemCollapsibleState.None, {
				// 				command: 'zhihu.openWebView',
				// 				title: 'openWebView',
				// 				arguments: [feed.target.question]
				// 			});
				// 		} else {
				// 			return new ZhihuTreeItem('', '', vscode.TreeItemCollapsibleState.None);
				// 		}
				// 	});
				// 	resolve(deps);

				// }
			});
		} else {
			return Promise.resolve(this.getCollectionsType());
		}

	}

	private async getCollectionsType(): Promise<CollectionItem[]> {
		await this.profileService.fetchProfile();
		return Promise.resolve(COLLECT_TYPES.map(c => {
			return new CollectionItem(c.ch, c.type, vscode.TreeItemCollapsibleState.Collapsed);
		}));
	}

}

export class CollectionItem extends vscode.TreeItem {

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
