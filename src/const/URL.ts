/**
 * GET, PUT, POST Captcha through this API
 */
export const CaptchaAPI = `https://www.zhihu.com/api/v3/oauth/captcha?lang=en`;


/**
 * Prefetch QRCode https://www.zhihu.com/api/v3/account/api/login/qrcode
 * Get QRCode https://www.zhihu.com/api/v3/account/api/login/qrcode/${token}/image
 * Query ScanInfo https://www.zhihu.com/api/v3/account/api/login/qrcode/${token}/scan_info
 */
export const QRCodeAPI = 'https://www.zhihu.com/api/v3/account/api/login/qrcode';

/**
 * API for Aliyun OSS File Upload
 */
export const ImageUpload = 'https://api.zhihu.com/images';


/**
 * Image-hosting domain for zhihu
 * `https://pic4.zhimg.com/80/${file_name}_hd.png`
 */
export const ImageHostAPI = 'https://pic4.zhimg.com/80';

/**
 * Get qrcode ticket
 */
export const UDIDAPI = 'https://www.zhihu.com/udid';

/**
 * POST Login data to this API to aquire authentication
 */
export const LoginAPI = 'https://www.zhihu.com/api/v3/oauth/sign_in';

/**
 * Helper link to indicate if already login in
 */
export const SignUpRedirectPage = 'https://www.zhihu.com/signup';

/**
 * Feed Story
 */
export const FeedStoryAPI = 'https://www.zhihu.com/api/v3/feed/topstory/recommend';

/**
 * Get hot stories
 */
export const HotStoryAPI = 'https://www.zhihu.com/api/v3/feed/topstory/hot-lists';

/**
 * Get info about myself
 */
export const SelfProfileAPI = 'https://www.zhihu.com/api/v4/me';

/**
 * AnswerAPI = `https://www.zhihu.com/api/v4/answers/${answerId}`
 * Voters = `https://www.zhihu.com/api/v4/answers/${answerId}/voters`
 */
export const AnswerAPI = 'https://www.zhihu.com/api/v4/answers';

/**
 * Answer URL 'https://www.zhihu.com/answers'
 */
export const AnswerURL = 'https://www.zhihu.com/answer';

/**
 * QuestionAPI = 'https://www.zhihu.com/api/v4/questions/${questionId}'
 */
export const QuestionAPI = 'https://www.zhihu.com/api/v4/questions'

/**
 * QuestionURL = 'https://www.zhihu.com/question/${question'
 */
export const QuestionURL = 'https://www.zhihu.com/question'

/**
 * ArticleAPI = 'https://zhuanlan.zhihu.com/api/articles/${articleId}/publish'
 * 
 * `POST` https://zhuanlan.zhihu.com/api/articles/drafts for creation
 * 
 * `PATCH` https://zhuanlan.zhihu.com/api/articles/${articleId}/draft` for patching
 * 
 * `PUT` https://zhuanlan.zhihu.com/api/articles/${articleId}/publish for publishing 
 */

export const ZhuanlanAPI = 'https://zhuanlan.zhihu.com/api/articles';

/**
 * get columns info
 * @param urltoken urlToken of people
 */
export function ColumnAPI(urltoken: string) {
	return `https://www.zhihu.com/api/v4/members/${urltoken}/column-contributions?include=data%5B*%5D.column.intro%2Cfollowers%2Carticles_count&offset=0&limit=20`
}

export function TopicsAPI(searchToken: string) {
	return `https://zhuanlan.zhihu.com/api/autocomplete/topics?token=${searchToken}&max_matches=5&use_similar=0&topic_filter=1`
}

/**
 * Html Page: 'https://zhuanlan.zhihu.com/p/${articleId}'
 */
export const ZhuanlanURL = 'https://zhuanlan.zhihu.com/p/';

/**
 * ArticleAPI = 'https://www.zhihu.com/api/v4/articles/${articleId}'
 */
export const ArticleAPI = 'https://www.zhihu.com/api/v4/articles'

/**
 * Search All items in Zhihu
 */
export const SearchAPI: string = "https://www.zhihu.com/api/v4/search_v3";

/**
 * return the href link of weixin qrcode
 * @param qrId the qrcode img src
 */
export function WeixinLoginQRCodeAPI(qrId: string) {
	return `https://open.weixin.qq.com${qrId}` + 
	"?appid=wx268fcfe924dcb171&redirect_uri=https%3A%2F%2Fwww.zhihu.com%2Foauth%2Fcallback%2Fwechat%3Faction%3Dlogin%26from%3D" +
	"&response_type=code&scope=snsapi_login&state=" +
	WeixinState +
	"#wechat"

}

export const WeixinState = "564c6550647442736e4552394f795a37474d4b4f4d4a794e7a6570414b394632";

export function WeixinLoginPageAPI(): string {
	return "https://open.weixin.qq.com/connect/qrconnect" + 
	"?appid=wx268fcfe924dcb171&redirect_uri=https%3A%2F%2Fwww.zhihu.com%2Foauth%2Fcallback%2Fwechat%3Faction%3Dlogin%26from%3D" +
	"&response_type=code&scope=snsapi_login&state=" +
	WeixinState
}

/**
 *  get sms
 */
export const SMSAPI = 'https://www.zhihu.com/api/v3/oauth/sign_in/digits';

/**
 *  default zhihu domain
 */
export const ZhihuDomain = 'zhihu.com'