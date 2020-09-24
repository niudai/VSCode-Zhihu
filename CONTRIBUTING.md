# Contributing

👍🎉 First off, thanks for taking the time to contribute! 🎉👍

When contributing to this project, please first discuss the changes you wish to make via an issue before making changes.

## Your First Code Contribution

Unsure where to begin contributing? You can start a new issue to give a feedback of bugs you found, features you wanna implemented, etc.

## Getting the code

```
git clone https://github.com/niudai/VSCode-Zhihu.git
```

Prerequisites

- [Git](https://git-scm.com/)
- [NodeJS](https://nodejs.org/), `>= 10.0.0`
- [npm](https://www.npmjs.com/), `>= 6.0.0`


## Dependencies

From a terminal, where you have cloned the repository, execute the following command to install the required dependencies:

```
npm install
```

## Build

run `npm install` first to install all deps and dev-deps.

VSCode-Zhihu uses webpack as dev&prod tool. In order to build and run, you need to execute `npm run develop` first, which compiles the typescript code and bundles them together into a single big .js file in `\dist` folder, and since the webpack starts in **watch mode**, evertime you altered the source .ts file, webpack would recompile for you, so you don't have to compile it manually.

> You don't need to execute `npm run develop` any more, cuz the `Launch Extenison` task do it for you.

You could check the scripts in `package.json` to see what `develop` do, knowing some webpack concepts would be helpful.

Since webpack is always used as bundler and minimizer in client side, the npm dependencies in this project would sometimes break the behavior of thoses packages used for front-end, which you will see later.

After the compiling phase, you could open the `debug` view in VSCode and run the `Launch Extension` to run it. If things goes right, a new VSCode windows would pop out.

Open the Zhihu view and execute any command provided by Zhihu, you would see this error:

```
Activating extension 'niudai.vscode-zhihu' failed: Cannot find module '../lib/utils.js'.
```

This is where the tricky stuff comes in. 

Here's the thing, the project use `pug` as its html template, and `pug` depends on `uglify-js` module, which you could find'em all in `/node_modules`. Things like pug, uglify-js are always used in server-side, in which people don't need to bundle them.

Webpack use syntaxes like `require()`, `import()` to recognize the dependency graph, but the code in `/node_modules/uglify-js/tools/node.js` just use the file I/O to read the file, making webpack misunderstand it. So to make the code run as it should, you should comment out this part of code in `/node_modules/uglify-js/tools/node.js`:

```js
var FILES = UglifyJS.FILES = [
    "../lib/utils.js",
    "../lib/ast.js",
    "../lib/parse.js",
    "../lib/transform.js",
    "../lib/scope.js",
    "../lib/output.js",
    "../lib/compress.js",
    "../lib/sourcemap.js",
    "../lib/mozilla-ast.js",
    "../lib/propmangle.js",
    "./exports.js",
].map(function(file){
    return require.resolve(file);
});

new Function("MOZ_SourceMap", "exports", FILES.map(function(file){
    return fs.readFileSync(file, "utf8");
}).join("\n\n"))(
    require("source-map"),
    UglifyJS
);

UglifyJS.AST_Node.warn_function = function(txt) {
    console.error("WARN: %s", txt);
};
```

after you do this, re-run `npm run develop` and launch extension again, you would find everything works.




