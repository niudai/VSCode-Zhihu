import * as path from "path";

import { runTests } from "vscode-test";

/**
 * run test
 */
async function main() {
    try {
        // The folder containing the Extension Manifest package.json
        // Passed to `--extensionDevelopmentPath`
        const extensionDevelopmentPath: string = path.resolve( __dirname, "../../" );

        // The path to the extension test script
        // Passed to --extensionTestsPath
        const extensionTestsPath: string = path.resolve( __dirname, "./suite/index" );

        // Download VS Code, unzip it and run the integration test
        await runTests( { extensionDevelopmentPath, extensionTestsPath } );
    } catch ( err ) {
        process.exit(1);
    }
}

main();
