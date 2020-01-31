
import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { CollectionPath } from "../const/PATH";
import { MediaTypes } from "../const/ENUM";
import { HttpService } from "./http.service";
import { AnswerAPI, QuestionAPI } from "../const/URL";
import { ITarget } from "../model/target/target";

export interface ICollectionItem {
	type: MediaTypes,
	id: string
}

export class CollectionService {
	public collection: ICollectionItem[];
	constructor (
		protected context: vscode.ExtensionContext,
		protected httpService: HttpService) {
		if(fs.existsSync(path.join(context.extensionPath, CollectionPath))) {
			this.collection = JSON.parse(fs.readFileSync(path.join(context.extensionPath, 'collection.json'), 'utf8'));
		} else {
			this.collection = []
		}
	}

	addItem(item: ICollectionItem) {
		this.collection.push(item);
		this.persist();
	}

	deleteItem(type: string, id: string) {
		this.collection = this.collection.filter(c => !(c.id == id && c.type == type))
		this.persist();
	}

	async getTargets(type: MediaTypes): Promise<(ITarget & any) []> {
		var _collection;
		if (type) _collection = this.collection.filter(c => c.type == type)
		else _collection = this.collection
		var c: ICollectionItem;
		var targets: ITarget[] = [];
		for (c of this.collection) {
			var t;
			if (c.type == MediaTypes.answer) {
				t = await this.httpService.sendRequest({
					uri: `${AnswerAPI}/${c.id}`,
					json: true
				})
			} else if (c.type == MediaTypes.question) {
				t = await this.httpService.sendRequest({
					uri: `${QuestionAPI}/${c.id}`,
					json: true
				})
			} else if (c.type == MediaTypes.article) {
				t = await this.httpService.sendRequest({
					uri: `${AnswerAPI}/${c.id}`,
					json: true
				})
			}	
			targets.push(t);	
		}
		return Promise.resolve(targets)
	}

	persist() {
		fs.writeFileSync(path.join(this.context.extensionPath, CollectionPath), JSON.stringify(this.collection), 'utf8');
	}

}