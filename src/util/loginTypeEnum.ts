
export enum LoginEnum {
	sms,
	password,
	qrcode
}

export const LoginTypes = [
	{ value: LoginEnum.qrcode, ch: '二维码'},
	{ value: LoginEnum.sms, ch: '短信验证码' },
	{ value: LoginEnum.password, ch: '密码' }
];
