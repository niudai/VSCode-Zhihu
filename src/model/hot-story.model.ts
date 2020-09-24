import { Paging } from "./paging.model";
import { IStoryTarget } from "./target/target";

export interface HotStoryPage {
	fresh_text?: string;
	paging?: Paging;
	data?: HotStory[];
}

export interface HotStory {
	style_type?: string;
	detail_text?: string;
	target?: IStoryTarget;
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