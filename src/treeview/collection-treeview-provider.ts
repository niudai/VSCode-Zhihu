import * as vscode from 'vscode';
import { MediaTypes } from '../const/ENUM';
import { CollectionService, ICollectionItem } from '../service/collection.service';
import { ProfileService } from '../service/profile.service';
import { IQuestionAnswerTarget, IQuestionTarget, IArticleTarget } from '../model/target/target';

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
				let targets = await this.collectionService.getTargets(element.type);
				resolve(targets.map(t => {
					return new CollectionItem(t.title ? t.title : t.excerpt, t.type, { type: t.type, id: t.id }, vscode.TreeItemCollapsibleState.None, {
						command: 'zhihu.openWebView',
						title: 'openWebView',
						arguments: [t]
					}, element, t);
				}))
			});
		} else {
			return Promise.resolve(this.getCollectionsType());
		}
	}

	getParent(element?: CollectionItem): Thenable<CollectionItem> {
		return Promise.resolve(element.parent);
	}

	private async getCollectionsType(): Promise<CollectionItem[]> {
		await this.profileService.fetchProfile();
		return Promise.resolve(COLLECT_TYPES.map(c => {
			return new CollectionItem(c.ch, c.type, undefined, vscode.TreeItemCollapsibleState.Collapsed);
		}));
	}

}

export class CollectionItem extends vscode.TreeItem {

	constructor(
		public readonly label: string,
		public type: MediaTypes,
		public item: ICollectionItem,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command,
		public readonly parent?: CollectionItem,
		public readonly target?: IQuestionAnswerTarget | IQuestionTarget | IArticleTarget,
	) {
		super(label, collapsibleState);
	}

	get tooltip(): string {
		return this.target ? this.target.excerpt : '';
	}

	get description(): string {
		return this.target ? this.target.excerpt : '';
	}

	// iconPath = {
	// 	light: vscode.ThemeIcon.File,
	// 	dark: vscode.ThemeIcon.File
	// };

	contextValue =  this.collapsibleState == vscode.TreeItemCollapsibleState.None ? 'collect-item' : this.type;

}
