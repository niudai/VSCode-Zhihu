import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";
import * as httpClient from "request-promise";
import * as vscode from "vscode";
import { DefaultHTTPHeader } from "../const/HTTP";
import { CaptchaAPI, LoginAPI, SignUpRedirectPage } from "../const/URL";
import { ILogin } from "../model/login.model";
import { ProfileService } from "../service/profile.service";
import { encryptLoginData } from "../util/loginEncrypt";
import { AccountService } from "../service/account.service";
// import * as formurlencoded from "form-urlencoded";
var formurlencoded = require('form-urlencoded').default;

export async function loginHandler(
	context: vscode.ExtensionContext,
	profileService: ProfileService,
	accountService: AccountService
	): Promise<void> {

	var headers = DefaultHTTPHeader;

	headers['cookie'] = fs.readFileSync(path.join(context.extensionPath, 'cookie.txt'));

	if (await accountService.isAuthenticated()) {
		vscode.window.showInformationMessage(`你已经登录了哦~ ${profileService.name}`);
		return;
	}

	fs.writeFileSync(path.join(context.extensionPath, 'cookie.txt'), '');

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
			"验证码",
			vscode.ViewColumn.One,
			{}
		);
		const imgSrc = panel.webview.asWebviewUri(vscode.Uri.file(
			path.join(context.extensionPath, './captcha.jpg')
		));
		panel.iconPath = vscode.Uri.file(path.join(context.extensionPath, 'media', 'zhihu-logo-material.svg'));
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
		var captcha: string | undefined = await vscode.window.showInputBox({
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

	let loginData: ILogin = {
		'client_id': 'c3cef7c66a1843f8b3a9e6a1e3160e20',
		'grant_type': 'password',
		'source': 'com.zhihu.web',
		'username': '+86' + phoneNumber,
		'password': password,
		'lang': 'en',
		'ref_source': 'homepage',
		'utm_source': '',
		'captcha': captcha,
		'timestamp': Math.round(new Date().getTime()),
		'signature': ''
	};

	loginData.signature = crypto.createHmac('sha1', 'd1b964811afb40118a12068ff74a12f4')
		.update(loginData.grant_type + loginData.client_id + loginData.source + loginData.timestamp.toString())
		.digest('hex');

	let encryptedFormData = encryptLoginData(formurlencoded(loginData));

	// vscode.window.showInformationMessage(encryptedFormData + formurlencoded(loginData));
	// vscode.window.showInformationMessage('登录成功!');


	headers['cookie'] = fs.readFileSync(path.join(context.extensionPath, 'cookie.txt'));

	var loginResp = await httpClient(
		{
			uri: LoginAPI,
			method: 'post',
			headers,
			body: encryptedFormData,
			gzip: true,
			resolveWithFullResponse: true,
			simple: false
		}, (error, resp) => {
			let cookieStr = '';
			resp.headers['set-cookie'].forEach(
				c => {
					c = c.split(';')[0];
					cookieStr = cookieStr.concat(c, '; ');
				}
			);
			console.log(resp.headers['set-cookie']);
			fs.appendFileSync(path.join(context.extensionPath, 'cookie.txt'), cookieStr, { encoding: 'utf8' });
			console.log(resp.statusCode);
		});

	if (loginResp.statusCode == '201') {
		vscode.window.showInformationMessage(`你好，${profileService.name}`);
	} else {
		vscode.window.showInformationMessage('登录失败！错误代码：' + loginResp.statusCode);
	}
}