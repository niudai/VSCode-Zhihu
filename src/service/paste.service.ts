import * as childProcess from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import * as md5 from "md5";
import * as OSS from "ali-oss";
import { ShellScriptPath } from "../const/PATH";
import { ImageAPI } from "../const/URL";
import { HttpService } from "./http.service";
import { ZhihuOSSAgent } from "../const/HTTP";
import { IImageUploadToken } from "../model/publish/image.model"


export class PasteService {

	constructor(
		protected context: vscode.ExtensionContext,
		protected httpService: HttpService
		) {
	}
	/**
	 * getCookieString
	 */
	public pasteImageToPath(imagePath?: string): string {
		console.log('Hello')
		if (!imagePath) {
			imagePath = path.join(this.context.extensionPath, 'image.png');
		}
		this.saveClipboardImageToFileAndGetPath(imagePath, (p, pathFromScript) => {
			console.log(p + pathFromScript);
			this.uploadImageToPath(imagePath);
		})
		return;
	}

	private uploadImageToPath(file?: string) {

		let zhihu_agent = ZhihuOSSAgent;

		let hash = md5(fs.readFileSync(file))

		var options = {
			method: "POST",
			uri: ImageAPI,
			body: {
				image_hash: hash,
				source: "answer"
			},
			headers: {},
			json: true
		};

		this.httpService.sendRequest(options).then((body: IImageUploadToken)  => {
			let upload_file = body.upload_file;
			zhihu_agent.options.accessKeyId = body.upload_token.access_id;
			zhihu_agent.options.accessKeySecret = body.upload_token.access_key;
			zhihu_agent.options.stsToken = body.upload_token.access_token;
			let client = new OSS(zhihu_agent.options);
			console.log(body);
			// object表示上传到OSS的Object名称，localfile表示本地文件或者文件路径
			client.put(upload_file.object_key, file).then(
				r => { 
					console.log(r)
					vscode.window.showInformationMessage('上传成功！')
				}
			).catch(r => console.error('OSS Put Error'));
			client.get(upload_file.object_key).then(
				r => console.log(r)
			).catch(r => console.error('OSS Get Error'));
		});
	}

	private saveClipboardImageToFileAndGetPath(imagePath, cb: (imagePath: string, imagePathFromScript: string) => void) {
		if (!imagePath) return;

		let platform = process.platform;
		if (platform === 'win32') {
			// Windows
			const scriptPath = path.join(this.context.extensionPath, ShellScriptPath, 'pc.ps1');

			let command = "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe";
			let powershellExisted = fs.existsSync(command)
			if (!powershellExisted) {
				command = "powershell"
			}

			const powershell = childProcess.spawn(command, [
				'-noprofile',
				'-noninteractive',
				'-nologo',
				'-sta',
				'-executionpolicy', 'unrestricted',
				'-windowstyle', 'hidden',
				'-file', scriptPath,
				imagePath
			]);
			powershell.on('error', function (e: Error) {
				vscode.window.showErrorMessage(e.message);
			});
			powershell.on('exit', function (code, signal) {
				// console.log('exit', code, signal);
			});
			powershell.stdout.on('data', function (data: Buffer) {
				cb(imagePath, data.toString().trim());
			});
		}
		else if (platform === 'darwin') {
			// Mac
			let scriptPath = path.join(__dirname, ShellScriptPath, 'mac.applescript');

			let ascript = childProcess.spawn('osascript', [scriptPath, imagePath]);
			ascript.on('error', function (e) {
				vscode.window.showErrorMessage(e.message);
			});
			ascript.on('exit', function (code, signal) {
				// console.log('exit',code,signal);
			});
			ascript.stdout.on('data', function (data: Buffer) {
				cb(imagePath, data.toString().trim());
			});
		} else {
			// Linux 

			let scriptPath = path.join(__dirname, ShellScriptPath, 'linux.sh');

			let ascript = childProcess.spawn('sh', [scriptPath, imagePath]);
			ascript.on('error', function (e) {
				vscode.window.showErrorMessage(e.message);
			});
			ascript.on('exit', function (code, signal) {
				// console.log('exit',code,signal);
			});
			ascript.stdout.on('data', function (data: Buffer) {
				let result = data.toString().trim();
				if (result == "no xclip") {
					vscode.window.showInformationMessage('You need to install xclip command first.');
					return;
				}
				cb(imagePath, result);
			});
		}
	}

}