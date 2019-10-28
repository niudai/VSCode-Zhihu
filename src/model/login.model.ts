export interface ILogin {
	captcha: any;
	clientId: string; // c3cef7c66a1843f8b3a9e6a1e3160e20
	grantType: string; // password
	lang: string; // cn
	password: string;
	refSource: string; // other_https://www.zhihu.com/signin?next=%2F
	signature: string; // "f2cb75687f5c493e8bc34f7cc430e7e985250c35"
	source: string; // com.zhihu.web
	timestamp: number; // instant.now()
	username: string; // +86 <PHONE_NUM>
}

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
