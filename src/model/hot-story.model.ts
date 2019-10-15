import { Paging } from "./paging.model";

export interface HotStoryPage {
	fresh_text?: string;
	paging?: Paging;
	data?: HotStory[];
}

export interface HotStory {
	style_type?: string;
	detail_text?: string;
	target?: {
		bound_topic_ids?: number[];
		excerpt?: string;
		answer_count?: number;
		is_following?: false;
		id?: number;
		author?: IAuthor;
		url?: string; // url of current questions;
		title?: string;
		created?: number;
		comment_count?: number;
		follower_count: number;
		type?: string;
	};
	trend?: number;
	debut?: boolean;
	card_id?: string;
	children?: [
		{
			type?: string;
			thumbnail?: string; // pic for current story
		}
	];
	attached_info: string;
	type: string;
	id: string;
}

export interface IAuthor {
	headline?: string;
	avatar_url?: string;
	avatar_url_template?: string;
	is_org?: boolean;
	name?: string;
	badge?: any;
	gender?: number;
	is_advertiser?: boolean;
	is_followed?: boolean;
	is_privacy?: boolean;
	url?: string;
	url_token?: string;
	type?: string;
	user_type?: string;
	id?: string;
}

export interface StoryTarget {
	bound_topic_ids: number[];
	
}