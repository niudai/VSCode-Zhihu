var fs = require('fs');
var httpClient = require('request-promise');
var path = require('path');
var crypto = require('crypto');
var formurlencoded = require('form-urlencoded').default;


capchaAPI = `https://www.zhihu.com/api/v3/oauth/captcha?lang=en`;

// Get Captcha:
httpClient(capchaAPI, { method: 'get'}, (error, resp) => {

    let cookieStr = '';
    resp.headers['set-cookie'].forEach(
        c => { 
            c = c.split(';')[0];
            cookieStr = cookieStr.concat(c, '; ') }
    )
    console.log(resp.headers['set-cookie']);
    if(JSON.parse(resp.body)['show_captcha']) {
		fs.writeFileSync(path.join(__dirname, 'cookie.txt'), cookieStr, 'utf8')
        getCaptcha({ 'Cookie': resp.headers['set-cookie']});
    }
});

function getCaptcha(headers) {
    httpClient(capchaAPI, { method:'put', headers}, (error, resp) => {
        let base64Image = JSON.parse(resp.body)['img_base64'].replace('\n', '');
        // fs.writeFileSync(path.join(__dirname, 'capcha.jpg'), Base64.atob(base64Image), 'binary');
        fs.writeFileSync(path.join(__dirname, 'capcha.jpg'), base64Image, 'base64');
	})
}














