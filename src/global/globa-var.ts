import * as path from "path";
import * as vscode from 'vscode';
import { Output } from './logger';

var context: vscode.ExtensionContext;

export function setContext(c: vscode.ExtensionContext) {
    Output('set context')
    context = c;
}

export function getExtensionPath() {
    return context ? context.extensionPath : path.join(__dirname, '../../') ;
}

export function getSubscriptions() {
    return context.subscriptions;
}

export function getGlobalState() {
    return context.globalState;
}