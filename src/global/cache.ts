import * as fs from "fs";
import * as path from "path";
import { getExtensionPath } from "./globa-var";

var cache = {}

if(!fs.existsSync(path.join(getExtensionPath(), './cache.json'))) {
    fs.createWriteStream(path.join(getExtensionPath(), './cookie.json')).end()
}

function persist() {
    fs.writeFileSync(path.join(getExtensionPath(), './cache.json'), JSON.stringify(cache), 'utf8');
}

export function setCache(key: string, value: string) {
    cache[key] = value;
    persist()
}

export function getCache(key: string) {
    return cache[key]
}

export function clearCache() {
    cache = {};
    fs.writeFileSync(path.join(getExtensionPath(), './cache.json'), '')
}
