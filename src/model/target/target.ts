export interface ITarget {
	id: number;
	type: string; // feed_advert should be filtered
	author: IAuthorTarget;
	url: string;
}

export interface IStoryTarget extends ITarget {
	bound_topic_ids?: number[];
	excerpt?: string;
	answer_count?: number;
	is_following?: false;
	title?: string;
	created?: number;
	comment_count?: number;
	follower_count: number;
}

export interface IProfile {
	id: string,
	url_token: string,
	name: string,
	use_default_avatar: false,
	avatar_url: string,
	avatar_url_template: string,
	is_org: false,
	type: string,
	url: string,
	user_type: string,
	headline: string,
	gender: number,
	uid: string,
}

export interface IQuestionAnswerTarget extends ITarget {
	answer_type?: string;
	question?: IQuestionTarget;
	is_collapsed?: boolean;
	created_time?: number;
	updated_time?: number;
	extras?: string;
	is_copyable?: boolean;
	is_normal?: boolean;
	content?: string; // inner Html
	editable_content?: string;
	excerpt?: string;
	relationship?: any;
}

export interface IQuestionTarget extends ITarget {
	title?: string;
	question_type?: string;
	created?: number;
	updated_time?: number;
	relationship?: any;

	/**
	 * with html tag
	 */
	detail: string,

	/**
	 *  no html tag
	 */
	excerpt: string 
}

export interface IArticleTarget extends ITarget {
	title: string;
	excerpt_title: string;
	image_url: string;
	created: number;
	updated: number;
	voteup_count: 4413;
	voting: 0;
	comment_count: 201;
	excerpt: string;
	excerpt_new: string;
}

export interface IFeedTarget {
	id: string;
	type: string;
	offset: number;
	verb: string;
	created_time: number;
	updated_time: number;
	target: IQuestionAnswerTarget & IArticleTarget;
}

export interface IAuthorTarget extends ITarget {
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
	url_token?: string;
	user_type?: string;
}

export interface ISearchTarget extends ITarget {
	title?: string;
	excerpt?: string;
	voteup_count?: number;
	comment_count?: number;
	created_time?: number;
	updated_time?: number;
	content?: string;
	thumbnail_info?: any;
	voting: number;
	relationship: any;
	flag?: any;
	attached_info_bytes?: string;
}
