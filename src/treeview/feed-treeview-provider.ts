import * as vscode from 'vscode';
import { FeedStoryAPI } from '../const/URL';
import { IArticleTarget, IQuestionAnswerTarget, ITarget, IFeedTarget } from '../model/target/target';
import { AccountService } from '../service/account.service';
import { HttpService, sendRequest } from '../service/http.service';
import { ProfileService } from '../service/profile.service';
import { LinkableTreeItem } from './hotstory-treeview-provider';
import { EventService, IEvent } from '../service/event.service';
import { MediaTypes } from '../const/ENUM';
import * as onChange from 'on-change';
import { removeHtmlTag, removeSpace, beautifyDate } from '../util/md-html-utils';

export interface FeedType {
	type?: string;
	ch?: string;
}

export const FEED_TYPES: FeedType[] = [
	{ type: 'feed', ch: '推荐' },
	{ type: 'event', ch: '安排' }
];

export class FeedTreeViewProvider implements vscode.TreeDataProvider<vscode.TreeItem> {

	private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | undefined> = new vscode.EventEmitter<vscode.TreeItem | undefined>();
	readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | undefined> = this._onDidChangeTreeData.event;

	constructor(
		private accountService: AccountService,
		private profileService: ProfileService,
		private eventService: EventService) {
	}

	refresh(node?: vscode.TreeItem): void {
		this._onDidChangeTreeData.fire(node);
	}

	getTreeItem(element: FeedTreeItem): vscode.TreeItem {
		return element;
	}

	getChildren(element?: FeedTreeItem): Thenable<vscode.TreeItem[]> {

		if (element) {
			if (element.type == 'root') {
				return Promise.resolve(FEED_TYPES.map(f => {
					return new FeedTreeItem(f.ch, f.type, f.type == 'feed' ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.Collapsed);
				}))
			} else if (element.type == 'feed') {
				return new Promise(async (resolve, reject) => {
					if (! await this.accountService.isAuthenticated()) {
						return resolve([new FeedTreeItem('(请先登录，查看个性内容)', '', vscode.TreeItemCollapsibleState.None)]);
					}
					let feedAPI = `${FeedStoryAPI}?page_number=${element.page}&limit=10&action=down`;
					let feedResp = await sendRequest(
						{
							uri: feedAPI,
							json: true,
							gzip: true
						});
					feedResp = feedResp.data.filter(f => { return f.target.type != 'feed_advert'; });
					let deps: FeedTreeItem[] = feedResp.map(feed => {
						let type = feed.target.type;
						if (type == MediaTypes.article) {
							return new FeedTreeItem(feed.target.title, feed.target.type, vscode.TreeItemCollapsibleState.None, {
								command: 'zhihu.openWebView',
								title: 'openWebView',
								arguments: [feed.target]
							}, feed.target);
						} else if (type == MediaTypes.answer) {
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
				})
			} else if (element.type == 'event') {
				let events = this.eventService.getEvents();
				// this.eventService.setEvents(onChange(events, (path, value, previousValue) => {
				// 	this.refresh(element);
				// }));
				return Promise.resolve(this.eventService.getEvents().map(e => {
					return new EventTreeItem(e, vscode.TreeItemCollapsibleState.None, element);
				}))
			}
		} else {
			return Promise.resolve(this.getRootItem());
		}

	}

	private async getRootItem(): Promise<FeedTreeItem[]> {
		await this.profileService.fetchProfile();
		return Promise.resolve([
			new FeedTreeItem(`${this.profileService.name} - ${this.profileService.headline}`, 'root', vscode.TreeItemCollapsibleState.Expanded, null, undefined, 0, this.profileService.avatarUrl)
		]);
	}

}

export class FeedTreeItem extends LinkableTreeItem {

	/**
	 * 
	 * @param label show in the tool bar
	 * @param type used to classify items
	 * @param collapsibleState if collapsible
	 * @param command command to be executed if clicked
	 * @param target stores the zhihu content object
	 * @param page stores the page number
	 * @param avatarUrl avatarUrl
	 */
	constructor(
		public readonly label: string,
		public type: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command,
		public readonly target?: IQuestionAnswerTarget | IArticleTarget,
		public page?: number,
		public avatarUrl?: string
	) {
		super(label, collapsibleState, target ? target.url : '');
	}

	get tooltip(): string | undefined {
		return this.target ? this.target.excerpt : '';
	}

	get description(): string {
		return this.target && this.target.excerpt ? this.target.excerpt : '';
	}

	iconPath = this.avatarUrl ? vscode.Uri.parse(this.avatarUrl) : false;

	contextValue = (this.type == 'feed') ? 'feed' : 'dependency';

}

export class EventTreeItem extends vscode.TreeItem {

	/**
	 * 
	 * @param event the event
	 * @param collapsibleState if collapsible
	 */
	constructor(
		public readonly event: IEvent,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly parent: vscode.TreeItem
	) {
		super(removeSpace(removeHtmlTag(event.content)).slice(0, 12) + '...', collapsibleState);
	}

	get tooltip(): string | undefined {
		return removeHtmlTag(this.event.content);
	}

	get description(): string {
		return beautifyDate(this.event.date);
	}

	iconPath = false;

	contextValue = 'event';

}
