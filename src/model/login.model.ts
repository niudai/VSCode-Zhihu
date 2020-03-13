export interface ILogin {
	client_id: string; // c3cef7c66a1843f8b3a9e6a1e3160e20
	grant_type: string; // password
	source: string; // com.zhihu.web
	username: string; // +86 <PHONE_NUM>
	password: string;
	lang: string; // cn
	ref_source: string; // other_https://www.zhihu.com/signin?next=%2F
	utm_source: '';
	captcha: any;
	timestamp: number; // instant.now()
	signature: string; 
}

export interface ISmsData {
	phone_no: string; // +86...,
	sms_type: string; // text as default
}