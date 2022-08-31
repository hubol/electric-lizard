const electron = require("electron");
const Store = require("electron-store");
const app = electron.app;

const BrowserWindow = electron.BrowserWindow;

const store = new Store();

const path = require("path");

let window;

function getStorableWindowProps(window) {
    const [width, height] = window.getSize();
    return { width, height, fullscreen: window.isFullScreen() || undefined };
}

function createWindow() {
    const windowProps = store.get('window');
    window = new BrowserWindow({ autoHideMenuBar: true, maximizable: false, ...windowProps });
    window.loadURL(`file://${path.join(__dirname, "app/index.html")}`);

    const saveWindowProps = () => store.set('window', getStorableWindowProps(window));

    window.on("resize", saveWindowProps);
    window.on("enter-full-screen", saveWindowProps);
    window.on("leave-full-screen", saveWindowProps);
    window.on("closed", () => window = null);
}

app.on("ready", createWindow);

app.on("window-all-closed", () => app.quit());

app.on("activate", () => {
    if (window === null)
        createWindow();
});
