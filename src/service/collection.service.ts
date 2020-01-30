
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

	getTargets(): Promise<ITarget>[] {
		return this.collection.map(c => {
			if (c.type == MediaTypes.answer) {
				return this.httpService.sendRequest({
					uri: `${AnswerAPI}/${c.id}`
				})
			} else if (c.type == MediaTypes.question) {
				return this.httpService.sendRequest({
					uri: `${QuestionAPI}/${c.id}`
				})
			} else if (c.type == MediaTypes.article) {
				return this.httpService.sendRequest({
					uri: `${AnswerAPI}/${c.id}`
				})
			}
		})
	}

	persist() {
		fs.writeFileSync(path.join(this.context.extensionPath, CollectionPath), JSON.stringify(this.collection), 'utf8');
	}

}