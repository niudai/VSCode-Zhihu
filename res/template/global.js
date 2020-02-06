const favoriteBtn = document.getElementById('favorite');
const vscode = acquireVsCodeApi();
favoriteBtn.addEventListener('click', e => {
	vscode.postMessage({
		command: 'collect'
	})
	console.log('Hello World')
})



