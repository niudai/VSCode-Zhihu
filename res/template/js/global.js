const favoriteBtn = document.getElementById('favorite');
const shareBtn = document.getElementById('share');
const openBtn = document.getElementById('open');
const upvoteCode = document.getElementById('upvote');
const vscode = acquireVsCodeApi();

function answerUpvote(id) {
	vscode.postMessage({
		command: 'upvoteAnswer',
		id: id
	})
	console.log(`Hello Upvoter! ${s}`)
}

favoriteBtn.addEventListener('click', e => {
	vscode.postMessage({
		command: 'collect'
	})
	console.log('Favorite Btn Clicked');
})
shareBtn.addEventListener('click', e => {
	vscode.postMessage({
		command: 'share'
	})
})
openBtn.addEventListener('click', e => {
	vscode.postMessage({
		command: 'open'
	})
})



