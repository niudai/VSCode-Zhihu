export enum MediaTypes {
	answer = 'answer',
	question = 'question',
	article = 'article'
}

export enum SearchTypes {
	general = 'general',
	question = 'question',
	answer = 'answer',
	article = 'article'
}

export const LegalImageExt = [ '.jpg', '.jpeg', '.gif', '.png' ]; 

export enum LoginEnum {
	sms,
	password,
	qrcode
}

export const LoginTypes = [
	{ value: LoginEnum.qrcode, ch: '二维码'},
	// { value: LoginEnum.sms, ch: '短信验证码' },
	{ value: LoginEnum.password, ch: '密码' }
];

export enum SettingEnum {
	useVSTheme = 'zhihu.useVSTheme',
}

export enum WebviewEvents {
	collect = 'collect',
	share = 'share'
}