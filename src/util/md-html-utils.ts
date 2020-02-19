var UNESCAPE_MD_RE = /\\([!"#$%&'()*+,\-.\/:;<=>?@[\\\]^_`{|}~])/g;

var HTML_ESCAPE_TEST_RE = /[&<>"]/;
var HTML_ESCAPE_REPLACE_RE = /[&<>"]/g;
var HTML_REPLACEMENTS = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;'
};

function replaceUnsafeChar(ch) {
	return HTML_REPLACEMENTS[ch];
}

function escapeHtml(str) {
	if (HTML_ESCAPE_TEST_RE.test(str)) {
		return str.replace(HTML_ESCAPE_REPLACE_RE, replaceUnsafeChar);
	}
	return str;
}

function unescapeMd(str) {
	if (str.indexOf('\\') < 0) { return str; }
	return str.replace(UNESCAPE_MD_RE, '$1');
}

/**
 * Remove html tag from text
 */
function removeHtmlTag(text: string) {
	let TagRegExp = /<[^<>]+\/?>/g;
	return text.replace(TagRegExp, '');
}

function removeSpace(text: string) {
	let SpaceReg = /\s+/g;
	return text.replace(SpaceReg, ' ');
}

/**
 * get human-readable time formate, like `5:24 pm`
 * @param hour the hour to be converted
 */
function beautifyDate(date: Date) {
	let hour = date.getHours(), minute = date.getMinutes();
	let isAm = hour < 12;
	return `${isAm ? hour : hour - 12}:${minute < 10 ? '0' + minute : minute} ${isAm ? 'am' : 'pm'}`
}

export { escapeHtml, unescapeMd, removeHtmlTag, removeSpace, beautifyDate }
