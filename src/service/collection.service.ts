
import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { CollectionPath } from "../const/PATH";
import { MediaTypes } from "../const/ENUM";
import { HttpService } from "./http.service";
import { AnswerAPI, QuestionAPI, ArticleAPI } from "../const/URL";
import { ITarget } from "../model/target/target";
import { getExtensionPath } from "../global/globalVar";

export interface ICollectionItem {
	type: MediaTypes,
	id: string
}

export class CollectionService {
	public collection: ICollectionItem[];
	constructor (
		protected httpService: HttpService) {
		if(fs.existsSync(path.join(getExtensionPath(), CollectionPath))) {
			this.collection = JSON.parse(fs.readFileSync(path.join(getExtensionPath(), 'collection.json'), 'utf8'));
		} else {
			this.collection = []
		}
	}

	addItem(item: ICollectionItem) {
		if(!this.collection.find(v => v.id == item.id && v.type == item.type)) {
			this.collection.push(item);
			this.persist();
			return true;
		} else return false;
	}

	deleteCollectionItem(item: ICollectionItem) {
		this.collection = this.collection.filter(c => !(c.id == item.id && c.type == item.type))
		this.persist();
	}

	async getTargets(type?: MediaTypes): Promise<(ITarget & any) []> {
		var _collection;
		if (type) _collection = this.collection.filter(c => c.type == type)
		else _collection = this.collection
		var c: ICollectionItem;
		var targets: ITarget[] = [];
		for (c of _collection) {
			var t;
			if (c.type == MediaTypes.answer) {
				t = await this.httpService.sendRequest({
					uri: `${AnswerAPI}/${c.id}?include=data[*].content,excerpt`,
					json: true,
					gzip: true
				})
			} else if (c.type == MediaTypes.question) {
				t = await this.httpService.sendRequest({
					uri: `${QuestionAPI}/${c.id}`,
					json: true,
					gzip: true
				})
			} else if (c.type == MediaTypes.article) {
				t = await this.httpService.sendRequest({
					uri: `${ArticleAPI}/${c.id}`,
					json: true,
					gzip: true
				})
			}	
			targets.push(t);	
		}
		return Promise.resolve(targets)
	}

	persist() {
		fs.writeFileSync(path.join(getExtensionPath(), CollectionPath), JSON.stringify(this.collection), 'utf8');
	}

}