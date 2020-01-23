import { Paging } from "./paging.model";
import { ISearchTarget } from "./target/target";


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
	object?: ISearchTarget;
	
}