import * as vscode from "vscode";
import * as httpClient from "request-promise";
import * as fs from "fs";
import * as path from "path";
import * as pug from "pug";

export async function loginHandler(context: vscode.ExtensionContext): Promise<void> {

	const CaptchaAPI = `https://www.zhihu.com/api/v3/oauth/captcha?lang=en`;

	vscode.window.showInformationMessage('验证码已写入工作区');
	httpClient(CaptchaAPI, { method: 'get'}, (error, resp) => {

		let cookieStr = '';
		resp.headers['set-cookie'].forEach(
			c => { 
				c = c.split(';')[0];
				cookieStr = cookieStr.concat(c, '; ');
			}
		);
		console.log(resp.headers['set-cookie']);
		if(JSON.parse(resp.body)['show_captcha']) {
			fs.writeFileSync(path.join(context.extensionPath, 'cookie.txt'), cookieStr, 'utf8');
			getCaptcha({ 'Cookie': resp.headers['set-cookie']});
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
                <title>Cat Coding</title>
            </head>
            <body>
                <img src="${imgSrc}" width="300" />
            </body>
            </html>
		`;
	});

	function getCaptcha(headers) {
		httpClient(CaptchaAPI, { method:'put', headers}, (error, resp) => {
			let base64Image = JSON.parse(resp.body)['img_base64'].replace('\n', '');
			fs.writeFileSync(path.join(context.extensionPath, './captcha.jpg'), base64Image, 'base64');
		});
	}
	
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