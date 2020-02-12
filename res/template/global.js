const favoriteBtn = document.getElementById('favorite');
const shareBtn = document.getElementById('share');
const vscode = acquireVsCodeApi();
favoriteBtn.addEventListener('click', e => {
	vscode.postMessage({
		command: 'collect'
	})
})
shareBtn.addEventListener('click', e => {
	vscode.postMessage({
		command: 'share'
	})
})


