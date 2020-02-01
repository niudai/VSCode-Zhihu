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

export { escapeHtml, unescapeMd }
