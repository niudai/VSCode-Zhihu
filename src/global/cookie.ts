import { getExtensionPath } from "./globa-var";
import * as path from "path"
import * as FileCookieStore from "tough-cookie-filestore";
import { CookieJar, Store } from "tough-cookie";
import { writeFileSync } from "fs";

var store: Store;
var cookieJar: CookieJar;

export function getCookieStore() {
    loadCookie()
    return store
}

export function clearCookieStore() {
    writeFileSync(path.join(getExtensionPath(), './cookie.json'), '');
}

export function getCookieJar() {
    loadCookie()
    return cookieJar
}

function loadCookie() {
    if (!store) {
        store = new FileCookieStore(path.join(getExtensionPath(), './cookie.json'));    
    }
    if (!cookieJar) {
        cookieJar = new CookieJar(store);
    }
}