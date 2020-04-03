export const DefaultHTTPHeader = {
	'accept-encoding': 'gzip',
	// 'Host': 'www.zhihu.com',
	// 'Referer': 'https://www.zhihu.com/',
	'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
		'(KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
	'content-type': 'application/x-www-form-urlencoded',
	// 'x-zse-83': '3_1.1',
	// 'x-xsrftoken': 'dCyt1Kb97IN7jeh5SJo92A9mw2bvv9Es',
}

export const LoginPostHeader = {
	'x-zse-83': '3_2.0',
	'x-xsrftoken': 'HXVUoGikKN8nor8BW9AZEdJAVayIRWSl',
	'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
	'(KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',		
	'accept-encoding': 'gzip',	
	'content-type': 'application/x-www-form-urlencoded'
}

export function WeixinLoginHeader(referer: string) {

	return {
		'authority': 'www.zhihu.com',
		'pragma': 'no-cache',
		'cache-control': 'no-cache',
		'upgrade-insecure-requests': 1,
		'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4099.0 Safari/537.36 Edg/83.0.473.0',
		'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
		'sec-fetch-site': 'cross-site',
		'sec-fetch-mode': 'navigate',
		'sec-fetch-user': '?1',
		'sec-fetch-dest': 'document',
		'accept-language': 'en-US,en;q=0.9',
		'Connection': 'keep-alive',
		'Accept-Encoding': 'gzip, deflate, br',
		'referer': encodeURIComponent(referer),

	}
}

export const QRCodeOptionHeader = {
	'authority': 'www.zhihu.com'
}

export const ZhihuOSSAgent = {
	userAgent: "aliyun-sdk-js/6.1.1 Chrome 81.0.4023.0 on Windows 10 64-bit",
	options: {
		accessKeyId: "STS.NUn1kMAT3Vd1rX5oeVr6j89y2", //
		accessKeySecret: "5XcAJT1xnifo6Vw9Wp3TsbCzBk79g9bY1DUqyAMRPGwy", // access_key
		stsToken: "CAISuQJ1q6Ft5B2yfSjIr5bbetH5rIsS4abacH6Ei2UDfrlG1/zS0Dz2IHpJeXNsA+gZtP01n2hT6/4YlqVrSpRCHnvZdc9355gPeOVzkR6E6aKP9rUhpMCPDQr6UmzkvqL7Z+H+U6mDGJOEYEzFkSle2KbzcS7YMXWuLZyOj+wRDLEQRRLqVSdaI91UKwB+yqodLmCDEfe2LibjmHbLdhQK3DBxkmRi86+y79SB4x7F9j3Ax/QSup76L+rWDbllN4wtVMyujq4kNPjT0C9Q9l1S9axty+5mgW6X4YnFWQQLs0vebruPrYNVQVUnNvRgKcltt+PhkPB0gOvXmrnsxgxFVeMvCH6CGdr8mpObQrrzbY5iKO6hIQDf0tGPK9ztsgg/JG8DMARDd58+MH5sBFkrTDXLOjdFBr9RksbIGoABD0qIVcA4CMJeGoHysYZtNBCvOxuQEDA6mSjTNs3+qlbjHM7MRvGhAo5zHg2YvRQckiOaT/MHFab7f/28bBsdmEg6+pnK3padBYIuYPvvx93/Z+n1Z5XQsEMwZbTbdkn1ksmymVYDbgih2i27AjE+9SDvUGBHTVandDAfADXc9AQ=",
		bucket: "zhihu-pics",
		endpoint: "zhihu-pics-upload.zhimg.com",
		region: "oss-cn-hangzhou",
		internal: false,
		secure: true,
		cname: true,
	}
};

