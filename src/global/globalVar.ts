import * as vscode from 'vscode';

var context: vscode.ExtensionContext;

export function setContext(c: vscode.ExtensionContext) {
    context = c;
}

export function getExtensionPath() {
    return context.extensionPath;
}

export function getSubscriptions() {
    return context.subscriptions;
}

export function getGlobalState() {
    return context.globalState;
}