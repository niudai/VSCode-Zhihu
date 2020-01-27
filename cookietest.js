const request = require('request-promise');
const cookieUtil = require('tough-cookie');
const Store = require('tough-cookie').MemoryCookieStore

request({
	uri: 'https://www.zhihu.com/signin?next=%2F',
	resolveWithFullResponse: true
}, (err, resp, body) => {
	console.log(resp.headers['set-cookie'])
	let cookieJar = new cookieUtil.CookieJar();
	resp.headers['set-cookie'].map(cookieUtil.Cookie.parse).forEach(c => cookieJar.setCookieSync(c, 'https://www.zhihu.com/signin?next=%2F', { loose: true }))
	console.log(cookieJar.getCookieStringSync('https://www.zhihu.com/signin?next=%2F'))
})

