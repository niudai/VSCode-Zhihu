import * as vscode from "vscode";
import { AtAutoCompleteURL } from "../const/URL";
import { sendRequest } from "../service/http.service";



export class ZhihuCompletionProvider implements vscode.CompletionItemProvider {

    async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext): Promise<vscode.CompletionItem[] | vscode.CompletionList> {
        // var curWord = document.getText(document.getWordRangeAtPosition(position));
        // if (curWord == '@') {
        var item = new vscode.CompletionItem('@ 知乎er？', vscode.CompletionItemKind.Event);
        item.command = { command: "zhihu.atPeople", title: "@ 知乎er" };
        item.insertText = "";
        // list.push(new vscode.Comp('牛岱', vscode.CompletionItemKind.EnumMember));
        return [item];
    }

    resolveCompletionItem?(item: vscode.CompletionItem, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CompletionItem> {
        throw new Error("Method not implemented.");
    }

}

export async function AtPeople() {
    const keywordString: string | undefined = await vscode.window.showInputBox({
        ignoreFocusOut: true,
        prompt: "输入你想 @ 的人：",
        placeHolder: "",
    });
    if (!keywordString) return;
    var respArray = (await sendRequest({
        uri: AtAutoCompleteURL(keywordString),
        gzip: true,
        json: true
    }))[0];
    if (!respArray) return;
    // respArray contains item like this:
    /**
     * [ 
     * "people",
     * "牛岱",
     * "niu-dai-68-44",
     * "https://pic3.zhimg.com/50/v2-7cafc2ea67c9088537e95f4f039486f5_s.jpg",
     * "b50644ff6e611664f9518847da1d2e05",
     * "VSCode知乎插件作者。微信公众号 小岱说",
     * [
     *     0,
     *     0,
     *     0
     * ],
     * ""
     * ]
     */
    const selectedPeople: any[] = await vscode.window.showQuickPick<vscode.QuickPickItem & { user: [] }>(
        respArray.slice(1).map(item => ({ user: item, id: item[2], label: item[1], description: item[5] })),
        { placeHolder: "选择你想要的结果:" }
    ).then(r => r ? r.user : undefined);
    if (!selectedPeople) return
    const editor = vscode.window.activeTextEditor;
    const uri = editor.document.uri;
    if (uri.scheme === "untitled") {
        vscode.window.showWarningMessage("请先保存当前编辑文件！");
        return;
    }
    editor.edit(e => {
        const current = editor.selection;
        var range: vscode.Range = new vscode.Range(new vscode.Position(current.start.line, current.start.character-1), current.start);
        e.delete(range);
        e.insert(current.start, `[@${selectedPeople[1]}](https://www.zhihu.com/people/${selectedPeople[2]})`)
    });

    // Output(selectedPeople, 'info');
    // this.webviewService.openWebview(selectedPeople.object);
}