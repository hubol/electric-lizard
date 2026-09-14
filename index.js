const electron = require("electron");
const app = electron.app;

const BrowserWindow = electron.BrowserWindow;

const path = require("path");

const lizardConfig = require("./lizard.json");

function parseInt(string) {
    const number = Number.parseInt(string ?? "NaN");
    return Number.isNaN(number) ? null : number;
}

function createWindows() {
    const displays = electron.screen.getAllDisplays();

    for (let screenIndex = 0; screenIndex < parseInt(lizardConfig.screensCount) ?? 1; screenIndex++) {
        const display = displays[screenIndex] ?? displays[displays.length - 1];
        const options = getBrowserWindowOptions(screenIndex, display);
        const window = new BrowserWindow(options);
        window.loadURL(`file://${path.join(__dirname, "app/index.html")}?screenIndex=${screenIndex}`);

        window.on("closed", () => app.quit());
    }
}

/**
 * 
 * @param {number} screenIndex 
 * @param {Electron.Display} display 
 * @returns {Electron.BrowserWindowConstructorOptions}
 */
function getBrowserWindowOptions(screenIndex, display) {
    let { x, y, width, height } = display.workArea;

    if (screenIndex === 0) {
        return { autoHideMenuBar: true, maximizable: false, fullscreen: true, x, y };
    }
    y -= 1;
    width += 2;
    height += 2

    return {
        autoHideMenuBar: true,
        maximizable: true,
        fullscreenable: false,
        width,
        height,
        roundedCorners: false,
        hasShadow: false,
        resizable: false,
        focusable: false,
        frame: false,
        x,
        y,
    }
}

app.on("ready", createWindows);