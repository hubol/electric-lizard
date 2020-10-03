const electron = require("electron");
const app = electron.app;

const BrowserWindow = electron.BrowserWindow;

const path = require("path");

let window;

function createWindow() {
    window = new BrowserWindow({ autoHideMenuBar: true, fullscreen: true });

    window.loadURL(`file://${path.join(__dirname, "app/index.html")}`);
    window.on("closed", () => (window = null));
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin")
        app.quit();
});

app.on("activate", () => {
    if (window === null)
        createWindow();
});