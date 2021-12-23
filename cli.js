const {build} = require("electron-builder");

const appId = process.env.APP_ID || "hubol.electron-app";
const productName = process.env.PRODUCT_NAME || "Electron App";
const platform = process.env.PLATFORM || "win";

const isWin = platform === 'win';

async function main() {
    const config = {
        directories: { output: 'dist' },
        appId,
        productName,
        files: [ "app/**/*", "index.js", "icon.png" ],
        win: isWin ? { target: 'dir' } : undefined
    }
    await build({ config });
}

main();
