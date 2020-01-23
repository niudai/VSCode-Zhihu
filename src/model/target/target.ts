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

interface IQuestionTarget extends ITarget {
	title?: string;
	question_type?: string;
	created?: number;
	updated_time?: number;
	relationship?: any;
}

interface IArticleTarget extends ITarget {
	title: "北方的“雪地代写”业务火了，南方人用“蟑螂刻字”反击";
	excerpt_title: "";
	image_url: string;
	comment_permission: "all";
	created: 1574999376;
	updated: 1574999487;
	voteup_count: 4413;
	voting: 0;
	comment_count: 201;
	linkbox: {
		"pic": "";
		"title": "";
		"url": "";
		"category": ""
	};
	excerpt: "社会越浮躁，人们越能发现“简单的快乐”的价值。 今年冬天，随着北方各地的雪季来临，北方人引以为傲的那份简单的快乐——雪地写字，也开始被标上了价格，实现了“商业化”。 北方人的嚣张 为了给不方便体验雪天众多乐趣的南方朋友一个聊以慰藉的机会，很…";
	excerpt_new: "社会越浮躁，人们越能发现“简单的快乐”的价值。 今年冬天，随着北方各地的雪季来临，北方人引以为傲的那份简单的快乐——雪地写字，也开始被标上了价格，实现了“商业化”。 北方人的嚣张 为了给不方便体验雪天众多乐趣的南方朋友一个聊以慰藉的机会，很…";
	preview_type: "default";
	preview_text: "";
}

export interface IFeedTarget {
	id: string;
	type: string;
	offset: number;
	verb: string;
	created_time: number;
	updated_time: number;
	target: IQuestionAnswerTarget | IArticleTarget;
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

export interface ISearchTarget {
	id?: number;
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
	author: IAuthorTarget;
	voting: number;
	relationship: any;
	flag?: any;
	attached_info_bytes?: string;
}
