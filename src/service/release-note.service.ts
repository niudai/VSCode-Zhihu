
import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { ReleaseNotesPath } from "../const/PATH";


export class ReleaseNotesService {
	constructor(
		protected context: vscode.ExtensionContext) {
		this.showReleaseNote();
	}

	showReleaseNote() {
		let fileNames: string[] = fs.readdirSync(path.join(this.context.extensionPath, ReleaseNotesPath))
		let mdFileReg = /^(\d)\.(\d)\.(\d)\.md$/;
		let latestVer = fileNames.filter(name => mdFileReg.test(name)).reduce((prev, curr, index, arr) => {
			return curr > prev ? curr : prev;
		});
		let usrLatestVer = this.context.globalState.get('latestVersion');
		if (!usrLatestVer || usrLatestVer < latestVer) {
			vscode.commands.executeCommand("markdown.showPreview", vscode.Uri.file(path.join(
				this.context.extensionPath, ReleaseNotesPath, latestVer
			)), null, {
				sideBySide: false,
				locked: true
			});
			this.context.globalState.update('latestVersion', latestVer);
		}
	}
}