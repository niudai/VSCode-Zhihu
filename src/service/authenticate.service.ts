import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { DefaultHTTPHeader } from "../const/HTTP";
import { ProfileService } from "./profile.service";
import { AccountService } from "./account.service";
import { FeedTreeViewProvider } from "../treeview/feed-treeview-provider";
import { HttpService } from "./http.service";
import { LoginEnum, LoginTypes } from "../util/loginTypeEnum";
import { CaptchaAPI, LoginAPI, SMSAPI } from "../const/URL";
import * as httpClient from "request-promise";
import { ILogin, ISmsData } from "../model/login.model";
import * as crypto from "crypto";
import * as zhihuEncrypt from "zhihu-encrypt";
import { WebviewService } from "./webview.service";
import { TemplatePath, LightIconPath, ZhihuIconName } from "../const/PATH";

var formurlencoded = require('form-urlencoded').default;

export class AuthenticateService {
	constructor(
		protected context: vscode.ExtensionContext,
		protected profileService: ProfileService,
		protected accountService: AccountService,
		protected feedTreeViewProvider: FeedTreeViewProvider,
		protected httpService: HttpService,
		protected webviewService: WebviewService) {
	}
	public logout() {
		try {
			fs.writeFileSync(path.join(this.context.extensionPath, 'cookie.txt'), '');
		} catch(error) {
			console.log(error);
		}
		vscode.window.showInformationMessage('注销成功！');
	}

	public async login() {
		var headers = DefaultHTTPHeader;

		headers['cookie'] = fs.readFileSync(path.join(this.context.extensionPath, 'cookie.txt'));
	
		if (await this.accountService.isAuthenticated()) {
			vscode.window.showInformationMessage(`你已经登录了哦~ ${this.profileService.name}`);
			return;
		}
	
		fs.writeFileSync(path.join(this.context.extensionPath, 'cookie.txt'), '');
	
		const selectedLoginType: LoginEnum = await vscode.window.showQuickPick<vscode.QuickPickItem & { value: LoginEnum }>(
			LoginTypes.map(type => ({ value: type.value, label: type.ch, description: '' })),
			{ placeHolder: "选择登录方式: " }
		).then(item => item.value);
	
		if (selectedLoginType == LoginEnum.password) {
			let resp = await this.httpService.sendRequest({
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
			fs.writeFileSync(path.join(this.context.extensionPath, 'cookie.txt'), cookieStr, 'utf8')
			if (JSON.parse(resp.body)['show_captcha']) {
				fs.writeFileSync(path.join(this.context.extensionPath, 'cookie.txt'), cookieStr, 'utf8');
				let captchaImg = await this.httpService.sendRequest({ 
					uri: CaptchaAPI,
					method: 'put',
					json: true,
					gzip: true
				});
				let base64Image = captchaImg['img_base64'].replace('\n', '');
				fs.writeFileSync(path.join(this.context.extensionPath, './captcha.jpg'), base64Image, 'base64');
			}
			const panel = vscode.window.createWebviewPanel("zhihu", "验证码", vscode.ViewColumn.One);
			const imgSrc = panel.webview.asWebviewUri(vscode.Uri.file(
				path.join(this.context.extensionPath, './captcha.jpg')
			));
			
			this.webviewService.renderHtml({
				viewType: 'zhihu',
				title: '验证码',
				showOptions: {
					viewColumn: vscode.ViewColumn.One,
					preserveFocus: true
				},
				pugTemplatePath: path.join(
					this.context.extensionPath,
					TemplatePath,
					'captcha.pug'
				),
				iconPath: path.join(
					this.context.extensionPath,
					LightIconPath,
					ZhihuIconName,
				),
				pugObjects: {
					title: '',
					captchaSrc: imgSrc.toString()
				}
			}, panel)
	
			do {
				var captcha: string | undefined = await vscode.window.showInputBox({
					prompt: "输入验证码",
					placeHolder: "",
					ignoreFocusOut: true
				});
				if (!captcha) return
				let headers = DefaultHTTPHeader;
				headers['cookie'] = fs.readFileSync
				resp = await this.httpService.sendRequest({
					method: 'POST',
					uri: CaptchaAPI,
					form: {
						input_text: captcha
					},
					json: true,
					simple: false,
					gzip: true,
					resolveWithFullResponse: true,
					headers: {
						'cookie': fs.readFileSync(path.join(this.context.extensionPath, 'cookie.txt'), 'utf8')
					},
				});
				if (resp.statusCode != 201) {
					vscode.window.showWarningMessage('请输入正确的验证码')
				}
			} while (resp.statusCode != 201);
	
			const phoneNumber: string | undefined = await vscode.window.showInputBox({
				ignoreFocusOut: true,
				prompt: "输入手机号或邮箱",
				placeHolder: "",
			});
			if (!phoneNumber) return;
	
			const password: string | undefined = await vscode.window.showInputBox({
				ignoreFocusOut: true,
				prompt: "输入密码",
				placeHolder: "",
				password: true
			});
			if (!password) return
	
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
	
			var loginResp = await this.httpService.sendRequest(
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
			fs.appendFileSync(path.join(this.context.extensionPath, 'cookie.txt'), cookieStr, { encoding: 'utf8' });
	
			this.profileService.fetchProfile().then(() => {
				if (loginResp.statusCode == '201') {
					vscode.window.showInformationMessage(`你好，${this.profileService.name}`);
					this.feedTreeViewProvider.refresh();
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
			var loginResp = await this.httpService.sendRequest(
				{
					uri: SMSAPI,
					method: 'post',
					body: encryptedFormData,
					gzip: true,
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
}