import * as vscode from "vscode";
import { sendRequest } from "../service/http.service";
import { AtAutoCompleteURL } from "../const/URL";

export class ZhihuCompletionProvider implements vscode.CompletionItemProvider {
    
    async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext): Promise<vscode.CompletionItem[] | vscode.CompletionList> {
        // var curWord = document.getText(document.getWordRangeAtPosition(position));
        // if (curWord == '@') {
        var list: vscode.CompletionItem[];
        var searchItem = '牛';
        var respArray = (await sendRequest({
            uri: AtAutoCompleteURL(searchItem),
            gzip: true,
            json: true
        }))[0];
        list = respArray
            .map(r => {
                if (r.length == 1) {
                    return undefined;
                }
                let c = new vscode.CompletionItem(r.length > 0 ? r[1] : undefined, vscode.CompletionItemKind.EnumMember);
                c.documentation = new vscode.MarkdownString(`![Image](${r[3]})\n **${r[1]}** \n *${r[5]}*\n\n`)
                return c;
            });
        // list.push(new vscode.Comp('牛岱', vscode.CompletionItemKind.EnumMember));
        return  Promise.resolve(list);
        // return list;
        // } else {
            // return null;
        // }
        // throw new Error("Method not implemented.");
    }
    
    resolveCompletionItem?(item: vscode.CompletionItem, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CompletionItem> {
        throw new Error("Method not implemented.");
    }

}