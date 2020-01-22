import * as vscode from "vscode";
import * as httpClient from "request-promise";
import * as fs from "fs";
import * as path from "path";
import * as pug from "pug";
import { type } from "os";

export async function loginHandler(context: vscode.ExtensionContext): Promise<void> {

	const CaptchaAPI = `https://www.zhihu.com/api/v3/oauth/captcha?lang=en`;

	httpClient(CaptchaAPI, { method: 'get' }, (error, resp) => {

		let cookieStr = '';
		resp.headers['set-cookie'].forEach(
			c => {
				c = c.split(';')[0];
				cookieStr = cookieStr.concat(c, '; ');
			}
		);
		console.log(resp.headers['set-cookie']);
		if (JSON.parse(resp.body)['show_captcha']) {
			fs.writeFileSync(path.join(context.extensionPath, 'cookie.txt'), cookieStr, 'utf8');
			getCaptcha({ 'Cookie': resp.headers['set-cookie'] });
		}
		const panel = vscode.window.createWebviewPanel(
			"zhihu",
			"captcha",
			vscode.ViewColumn.One,
			{}
		);
		const imgSrc = panel.webview.asWebviewUri(vscode.Uri.file(
			path.join(context.extensionPath, './captcha.jpg')
		));
		panel.webview.html = `
		<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <!--
                Use a content security policy to only allow loading images from https or from our extension directory,
                and only allow scripts that have a specific nonce.
                -->
				<title>Captcha</title>
				<style>
					img {
						max-width: 100%;
						max-height: 100%;
						margin: 0 auto;
						margin-top: 20%;
						display: block;
						border-style: ridge;
						border-radius: 20px;
						background-color: blanchedalmond;
						width: 500;
					}
				</style>
            </head>
            <body>
                <img src="${imgSrc}" width="500" />
            </body>
            </html>
		`;
	});

	function getCaptcha(headers) {
		httpClient(CaptchaAPI, { method: 'put', headers }, (error, resp) => {
			let base64Image = JSON.parse(resp.body)['img_base64'].replace('\n', '');
			fs.writeFileSync(path.join(context.extensionPath, './captcha.jpg'), base64Image, 'base64');
		});
	}

	var resp: any;
	do {
		const captcha: string | undefined = await vscode.window.showInputBox({
			prompt: "输入验证码",
			placeHolder: "",
			ignoreFocusOut: true
		});
		resp = await httpClient({
			method: 'POST',
			uri: CaptchaAPI,
			form: {
				input_text: captcha
			},
			headers: {
				'cookie': fs.readFileSync(path.join(context.extensionPath, 'cookie.txt'), 'utf8')
			},
			json: true
		});
		vscode.window.showErrorMessage(resp.toString());
	} while (resp.success != true);

	// vscode.window.showInformationMessage(resp);

	const phoneNumber: string | undefined = await vscode.window.showInputBox({
		ignoreFocusOut: true,
		prompt: "输入手机号或邮箱",
		placeHolder: "",
	});
	if (!phoneNumber) {
		return;
	}
	const password: string | undefined = await vscode.window.showInputBox({
		ignoreFocusOut: true,
		prompt: "输入密码",
		placeHolder: "",
		password: true
	});


	vscode.window.showInformationMessage('登录成功!');
}