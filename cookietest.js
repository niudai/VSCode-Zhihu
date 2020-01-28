const request = require('request-promise');
const cookieUtil = require('tough-cookie');
const Store = require('tough-cookie').MemoryCookieStore

request({
	uri: 'https://www.zhihu.com/',
	resolveWithFullResponse: true
}, (err, resp, body) => {
	console.log(resp.headers['set-cookie'])
	let store = new cookieUtil.MemoryCookieStore();
	let cookieJar = new cookieUtil.CookieJar(store);
	resp.headers['set-cookie'].map(cookieUtil.Cookie.parse).forEach(c => cookieJar.setCookieSync(c, 'https://www.zhihu.com/', { loose: true }))
	console.log(cookieJar.getCookiesSync('https://www.zhihu.com/'))
	store.removeCookies('zhihu.com', null, err => err)
	console.log(cookieJar.getCookiesSync('https://www.zhihu.com/'))
})