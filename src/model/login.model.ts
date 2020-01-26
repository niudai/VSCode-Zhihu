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
	signature: string; // "f2cb75687f5c493e8bc34f7cc430e7e985250c35"
}

export interface ISmsData {
	phone_no: string; // +86...,
	sms_type: string; // text as default
}

// url encoded phone_no=%2B8618324748963&sms_type=text

// captcha: "{"img_size":[200,44],"input_points":[[85.36363220214844,17.875]]}"
// clientId: "c3cef7c66a1843f8b3a9e6a1e3160e20"
// grantType: "password"
// lang: "cn"
// password: "niudai123."
// refSource: "other_https://www.zhihu.com/signin?next=%2F"
// signature: "f2cb75687f5c493e8bc34f7cc430e7e985250c35"
// source: "com.zhihu.web"
// timestamp: 1572186675095
// username: "+8618324748963"
