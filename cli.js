const {build} = require("electron-builder");
const {rename, copyFile, mkdir, rmdir} = require("fs").promises;
const {existsSync} = require("fs")

const appId = process.env.APP_ID || "hubol.electron-app";
const productName = process.env.PRODUCT_NAME || "Electron App";
const platform = process.env.PLATFORM || "win";

const isWin = platform === 'win';

function target() {
    if (isWin)
        return {
            win: {
                target: 'dir',
            },
            afterAllArtifactBuild: async c => {
                console.log('Post-artifact build...');
                console.log(c);
                const productName = c.configuration.productName;
                const exeName = `${productName}.exe`;
                if (existsSync('./dist/win'))
                    await rmdir('./dist/win', { recursive: true });
                await mkdir('./dist/win');
                await rename('./dist/win-unpacked', './dist/win/bin');
                await rename(`./dist/win/bin/${exeName}`, './dist/win/bin/app.exe');
                await copyFile(`./boot.exe`, './dist/win/app.exe');
                await rename(`./dist/win/app.exe`, `./dist/win/${exeName}`);
                console.log('...Done with Post-artifact build.');
            }
        };
    return {};
}

async function main() {
    const config = {
        directories: { output: 'dist' },
        appId,
        productName,
        files: [ "app/**/*", "index.js", "icon.png" ],
        ...target()
    }
    await build({ config });
}

main();