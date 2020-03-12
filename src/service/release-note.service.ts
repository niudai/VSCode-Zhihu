
import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { ReleaseNotesPath } from "../const/PATH";
import { getGlobalState, getExtensionPath } from "../global/globalVar";


export class ReleaseNotesService {
	constructor() {
		this.showReleaseNote();
	}

	showReleaseNote() {
		let fileNames: string[] = fs.readdirSync(path.join(getExtensionPath(), ReleaseNotesPath))
		let mdFileReg = /^(\d)\.(\d)\.(\d)\.md$/;
		let latestVer = fileNames.filter(name => mdFileReg.test(name)).reduce((prev, curr, index, arr) => {
			return curr > prev ? curr : prev;
		});
		let usrLatestVer = getGlobalState().get('latestVersion');
		if (!usrLatestVer || usrLatestVer < latestVer) {
			vscode.commands.executeCommand("markdown.showPreview", vscode.Uri.file(path.join(
				getExtensionPath(), ReleaseNotesPath, latestVer
			)), null, {
				sideBySide: false,
				locked: true
			});
			getGlobalState().update('latestVersion', latestVer);
		}
	}
}

