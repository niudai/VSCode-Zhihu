import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import * as zhihuEncrypt from "zhihu-encrypt";
import { DefaultHTTPHeader, LoginPostHeader, QRCodeOptionHeader } from "../const/HTTP";
import { TemplatePath } from "../const/PATH";
import { CaptchaAPI, LoginAPI, SMSAPI, QRCodeAPI, UDIDAPI } from "../const/URL";
import { ILogin, ISmsData } from "../model/login.model";
import { FeedTreeViewProvider } from "../treeview/feed-treeview-provider";
import { LoginEnum, LoginTypes, SettingEnum } from "../const/ENUM";
import { AccountService } from "./account.service";
import { HttpService } from "./http.service";
import { ProfileService } from "./profile.service";
import { WebviewService } from "./webview.service";
import { getExtensionPath } from "../global/globalVar";

var formurlencoded = require('form-urlencoded').default;

export class AuthenticateService {
	constructor(
		protected profileService: ProfileService,
		protected accountService: AccountService,
		protected feedTreeViewProvider: FeedTreeViewProvider,
		protected httpService: HttpService,
		protected webviewService: WebviewService) {
	}
	public logout() {
		try {
			this.httpService.clearCookie();
			this.feedTreeViewProvider.refresh();
			// fs.writeFileSync(path.join(getExtensionPath(), 'cookie.txt'), '');
		} catch(error) {
			console.log(error);
		}
		vscode.window.showInformationMessage('注销成功！');
	}

	public async login() {
	
		if (await this.accountService.isAuthenticated()) {
			vscode.window.showInformationMessage(`你已经登录了哦~ ${this.profileService.name}`);
			return;
		}
		
		const selectedLoginType: LoginEnum = await vscode.window.showQuickPick<vscode.QuickPickItem & { value: LoginEnum }>(
			LoginTypes.map(type => ({ value: type.value, label: type.ch, description: '' })),
			{ placeHolder: "选择登录方式: " }
		).then(item => item.value);
	
		if (selectedLoginType == LoginEnum.password) {
			this.passwordLogin();
		} else if (selectedLoginType == LoginEnum.sms) {
			this.smsLogin();
		} else if (selectedLoginType == LoginEnum.qrcode) {
			this.qrcodeLogin();
		} 
	}

	public async passwordLogin() {
		let resp = await this.httpService.sendRequest({
			uri: CaptchaAPI,
			method: 'get',
			gzip: true,
			json: true
		});

		if (resp.show_captcha) {
			let captchaImg = await this.httpService.sendRequest({ 
				uri: CaptchaAPI,
				method: 'put',
				json: true,
				gzip: true
			});
			let base64Image = captchaImg['img_base64'].replace('\n', '');
			fs.writeFileSync(path.join(getExtensionPath(), './captcha.jpg'), base64Image, 'base64');
			const panel = vscode.window.createWebviewPanel("zhihu", "验证码", { viewColumn: vscode.ViewColumn.One, preserveFocus: true });
			const imgSrc = panel.webview.asWebviewUri(vscode.Uri.file(
				path.join(getExtensionPath(), './captcha.jpg')
			));
			
			this.webviewService.renderHtml({
				title: '验证码',
				showOptions: {
					viewColumn: vscode.ViewColumn.One,
					preserveFocus: true
				},
				pugTemplatePath: path.join(
					getExtensionPath(),
					TemplatePath,
					'captcha.pug'
				),
				pugObjects: {
					title: '验证码',
					captchaSrc: imgSrc.toString(),
					useVSTheme: vscode.workspace.getConfiguration('zhihu').get(SettingEnum.useVSTheme)
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
				});
				if (resp.statusCode != 201) { 
					vscode.window.showWarningMessage('请输入正确的验证码')
				}
			} while (resp.statusCode != 201);
			vscode.window.showInformationMessage('验证码正确。')
			panel.dispose()
		}

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
				simple: false,
				headers: LoginPostHeader
			});

		this.profileService.fetchProfile().then(() => {
			if (loginResp.statusCode == '201') {
				vscode.window.showInformationMessage(`你好，${this.profileService.name}`);
				this.feedTreeViewProvider.refresh();
			} else if (loginResp.statusCode == '401') {
				vscode.window.showInformationMessage('密码错误！' + loginResp.statusCode);
			} else {
				vscode.window.showInformationMessage('登录失败！错误代码' + loginResp.statusCode);
			}
		})
	}

	public async smsLogin() {
		await this.httpService.sendRequest({
			uri: 'https://www.zhihu.com/signin'
		})
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
				simple: false,
				json: true
			});
		console.log(loginResp);
		const smsCaptcha: string | undefined = await vscode.window.showInputBox({
			ignoreFocusOut: true,
			prompt: "输入短信验证码：",
			placeHolder: "",
		});		
	}

	public async qrcodeLogin() {
		await this.httpService.sendRequest({
			uri: UDIDAPI,
			method: 'post'
		});
		let resp = await this.httpService.sendRequest({
			uri: QRCodeAPI,
			method: 'post',
			json: true,
			gzip: true,
			header: QRCodeOptionHeader
		});
		let qrcode = await this.httpService.sendRequest({
			uri: `${QRCodeAPI}/${resp.token}/image`,
			encoding: null
		});
		fs.writeFileSync(path.join(getExtensionPath(), 'qrcode.png'), qrcode);
		const panel = vscode.window.createWebviewPanel("zhihu", "验证码", { viewColumn: vscode.ViewColumn.One, preserveFocus: true });
		const imgSrc = panel.webview.asWebviewUri(vscode.Uri.file(
			path.join(getExtensionPath(), './qrcode.png')
		))
		this.webviewService.renderHtml(
			{
				title: '二维码',
				showOptions: {
					viewColumn: vscode.ViewColumn.One,
					preserveFocus: true
				},
				pugTemplatePath: path.join(
					getExtensionPath(),
					TemplatePath,
					'qrcode.pug'
				),
				pugObjects: {
					title: '打开知乎 APP 扫一扫',
					qrcodeSrc: imgSrc.toString(),
					useVSTheme: vscode.workspace.getConfiguration('zhihu').get(SettingEnum.useVSTheme)
				}
			},
			panel
		);
		let intervalId = setInterval(() => {
			this.httpService.sendRequest({
				uri: `${QRCodeAPI}/${resp.token}/scan_info`,
				json: true,
				gzip: true
			}).then(
				r => {
					if (r.status == 1) {
						vscode.window.showInformationMessage('请在手机上确认登录！');
					} else if (r.user_id) {
						clearInterval(intervalId);
						panel.dispose();
						this.profileService.fetchProfile().then(() => {
							vscode.window.showInformationMessage(`你好，${this.profileService.name}`);
							this.feedTreeViewProvider.refresh();	
						})
					}
				}
			);
		}, 1000)
		panel.onDidDispose(() => { 
			console.log('Window is disposed')
			clearInterval(intervalId)
		})
	}
}