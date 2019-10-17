import { Paging } from "./paging.model";
import { IAuthor } from "./hot-story.model";


export interface ISearchResults {
	data?: ISearchItem[];
	paging?: Paging;
}

export interface ISearchItem {
	type?: string;
	highlight?: {
		description?: string;
		title?: string;
	};
	object?: {

	}
}

export interface ISearchObject {
	id?: string;
	title?: string;
	type?: string;
	url?: string;
	excerpt?: string;
	voteup_count?: number;
	comment_count?: number;
	created_time?: number;
	updated_time?: number;
	content?: string;
	thumbnail_info?: any;
	author: IAuthor;
	voting: number;
	relationship: any;
	flag?: any;
	attached_info_bytes?: string;
}