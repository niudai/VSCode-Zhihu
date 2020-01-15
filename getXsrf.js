var fs = require('fs');
var httpClient = require('request-promise');
var path = require('path');

capchaAPI = `https://www.zhihu.com/`;

// Get Captcha:
httpClient(capchaAPI, { method: 'get'}, (error, resp) => {

	// console.log(resp.headers['set-cookie']);
	console.log(resp.headers['set-cookie']);
	headers = resp.headers['set-cookie'].filter(c => {
		return c.startsWith('_xsrf')
	})
	xsrf = headers[0].concat('\n');
	fs.writeFileSync(path.join(__dirname, 'cookie.txt'), xsrf, { encoding: 'utf-8', flag: 'a'},);
    // getCaptcha({ 'Cookie': resp.headers['set-cookie']});
});














