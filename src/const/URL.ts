/**
 * GET, PUT, POST Captcha through this API
 */
export const CaptchaAPI = `https://www.zhihu.com/api/v3/oauth/captcha?lang=en`;

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
 * AnswerAPI = 'https://www.zhihu.com/api/v4/answers/${answerId}'
 */
export const AnswerAPI = 'https://www.zhihu.com/api/v4/answers';

/**
 * QuestionAPI = 'https://www.zhihu.com/api/v4/questions/${questionId}'
 */
export const QuestionAPI = 'https://www.zhihu.com/api/v4/questions'

/**
 * ArticleAPI = 'https://www.zhihu.com/api/v4/articles/${articleId}'
 */
export const ArticleAPI = 'https://www.zhihu.com/api/v4/articles'

/**
 *  get sms
 */
export const SMSAPI = 'https://www.zhihu.com/api/v3/oauth/sign_in/digits';

/**
 *  default zhihu domain
 */
export const ZhihuDomain = 'zhihu.com'