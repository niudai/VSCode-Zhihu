
import * as vscode from "vscode";
import { IProfile } from "../model/target/target";
import { PasteService } from "./paste.service";
import { ZhihuPicReg } from "../const/REG";
import Token = require("markdown-it/lib/token");

export class PipeService {
	public profile: IProfile;

	constructor(protected pasteService: PasteService) {
	}

	/**
	 * convert all cors or local resources into under-zhihu resources
	 * @param tokens 
	 */
	public async sanitizeMdTokens(tokens: Token[]): Promise<Token[]> {
		let images = this.findCorsImage(tokens);
		for (let img of images) {
			img.attrs[0][1] = await this.pasteService.uploadImageFromLink(img.attrs[0][1]);
		}
		return Promise.resolve(tokens);
	}

	private findCorsImage(tokens) {
		let images = [];
		tokens.forEach(t => images = images.concat(this._findCorsImage(t)));
		return images;
	}

	private _findCorsImage(token) {
		let images = [];
		if (token.type == 'image') {
			if (!ZhihuPicReg.test(token.attrs[0][1]))
				images.push(token);
		};
		if (token.children) {
			token.children.forEach(t => images = images.concat(this._findCorsImage(t)))
		}
		return images;
	}

}