import { ITarget, IAuthorTarget } from "../target/target";
import { IColumn } from "./column.model";

export interface IPostArticle {
	
	/**
	 * background image link
	 */
	titleImage: string; // title image link
	
	isTitleImageFullScreen: boolean;
	
	delta_time: number; // usually 0
	
	/**
	 * article title
	 */
	title: string; 

	/**
	 * inner html for content
	 */
	content: string;

	column: IColumn;
}

export interface IPostArticleResp extends ITarget {
	updated: number, 
	reviewers: [], 
	topics: [], 
	excerpt: string, 
	excerpt_title: string, 
	title_image_size: {"width": 0, "height": 0}, 
	title: string, 
	comment_permission: string, 
	summary: string, 
	content: string, 
	has_publishing_draft: false, 
	state: string, 
	is_title_image_full_screen: false, 
	created: 1581062490, 
	image_url: string, 
	title_image: string, 
}