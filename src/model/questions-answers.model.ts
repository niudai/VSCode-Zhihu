import { IAuthor } from "./hot-story.model";

export interface QuestionAnswers {
	data: QuestionAnswer[];
}

export interface QuestionAnswer {
	id?: number;
	type?: string;
	answer_type?: string;
	question?: IQuestion;
	author?: IAuthor;
	url?: string;
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

interface IQuestion {
	type?: string;
	id?: number;
	title?: string;
	question_type?: string;
	created?: number;
	updated_time?: number;
	url?: string;
	relationship?: any;
}