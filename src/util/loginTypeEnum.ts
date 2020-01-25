
export enum LoginEnum {
	sms,
	password
}

export const LoginTypes = [
	{ value: LoginEnum.sms, ch: '短信验证码' },
	{ value: LoginEnum.password, ch: '密码' }
];
