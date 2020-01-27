import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";
import * as httpClient from "request-promise";
import * as vscode from "vscode";
import * as zhihuEncrypt from "zhihu-encrypt";
import { DefaultHTTPHeader } from "../const/HTTP";
import { CaptchaAPI, LoginAPI, SMSAPI } from "../const/URL";
import { ILogin, ISmsData } from "../model/login.model";
import { AccountService } from "../service/account.service";
import { HttpService } from "../service/http.service";
import { ProfileService } from "../service/profile.service";
import { FeedTreeViewProvider } from "../treeview/feed-treeview-provider";
import { LoginEnum, LoginTypes } from "../util/loginTypeEnum";
// import * as formurlencoded from "form-urlencoded";
var formurlencoded = require('form-urlencoded').default;

export async function loginHandler(
	context: vscode.ExtensionContext,
	profileService: ProfileService,
	accountService: AccountService,
	feedTreeViewProvider: FeedTreeViewProvider,
	httpService: HttpService
): Promise<void> {

	var headers = DefaultHTTPHeader;

	headers['cookie'] = fs.readFileSync(path.join(context.extensionPath, 'cookie.txt'));

	if (await accountService.isAuthenticated()) {
		vscode.window.showInformationMessage(`你已经登录了哦~ ${profileService.name}`);
		return;
	}

	fs.writeFileSync(path.join(context.extensionPath, 'cookie.txt'), '');

	const selectedLoginType: LoginEnum = await vscode.window.showQuickPick<vscode.QuickPickItem & { value: LoginEnum }>(
		LoginTypes.map(type => ({ value: type.value, label: type.ch, description: '' })),
		{ placeHolder: "选择登录方式: " }
	).then(item => item.value);

	if (selectedLoginType == LoginEnum.password) {
		let resp = await httpService.sendRequest({
			uri: CaptchaAPI,
			method: 'get', resolveWithFullResponse: true, gzip: true
		});

		let cookieStr = '';
		resp.headers['set-cookie'].forEach(
			c => {
				c = c.split(';')[0];
				cookieStr = cookieStr.concat(c, '; ');
			}
		);
		if (JSON.parse(resp.body)['show_captcha']) {
			fs.writeFileSync(path.join(context.extensionPath, 'cookie.txt'), cookieStr, 'utf8');
			getCaptcha({ 'Cookie': resp.headers['set-cookie'] });
		}
		const panel = vscode.window.createWebviewPanel(
			"zhihu",
			"验证码",
			{
				viewColumn: vscode.ViewColumn.One,
				preserveFocus: true
			}
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

		function getCaptcha(headers) {
			httpClient(CaptchaAPI, { method: 'put', headers }, (error, resp) => {
				let base64Image = JSON.parse(resp.body)['img_base64'].replace('\n', '');
				fs.writeFileSync(path.join(context.extensionPath, './captcha.jpg'), base64Image, 'base64');
			});
		}

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

		let encryptedFormData = zhihuEncrypt.loginEncrypt(formurlencoded(loginData));

		var loginResp = await httpService.sendRequest(
			{
				uri: LoginAPI,
				method: 'post',
				body: encryptedFormData,
				gzip: true,
				resolveWithFullResponse: true,
				simple: false
			});
		cookieStr = '';
		loginResp.headers['set-cookie'].forEach(
			c => {
				c = c.split(';')[0];
				cookieStr = cookieStr.concat(c, '; ');
			}
		);
		fs.appendFileSync(path.join(context.extensionPath, 'cookie.txt'), cookieStr, { encoding: 'utf8' });

		profileService.fetchProfile().then(() => {
			if (loginResp.statusCode == '201') {
				vscode.window.showInformationMessage(`你好，${profileService.name}`);
				feedTreeViewProvider.refresh();
			} else {
				vscode.window.showInformationMessage('登录失败！错误代码：' + loginResp.statusCode);
			}
		})
	} else if (selectedLoginType == LoginEnum.sms) {
		const phoneNumber: string | undefined = await vscode.window.showInputBox({
			ignoreFocusOut: true,
			prompt: "输入手机号或邮箱",
			placeHolder: "",
		});
		if (!phoneNumber) {
			return;
		}
		let smsData: ISmsData = {
			phone_no: '+86' + phoneNumber,
			sms_type: 'text'
		};
		
		let encryptedFormData = zhihuEncrypt.smsEncrypt(formurlencoded(smsData));

		// phone_no%3D%252B8618324748963%26sms_type%3Dtext
		var loginResp = await httpService.sendRequest(
			{
				uri: SMSAPI,
				method: 'post',
				body: encryptedFormData,
				gzip: true,
				// form: true,
				resolveWithFullResponse: true,
				simple: false
			});
		console.log(loginResp);
		const smsCaptcha: string | undefined = await vscode.window.showInputBox({
			ignoreFocusOut: true,
			prompt: "输入短信验证码：",
			placeHolder: "",
		});


	}


}

function passwordLoginHandler() {

}