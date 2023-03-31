const electron = require("electron");
const Store = require("electron-store");

const { app, BrowserWindow, ipcMain } = electron;

const store = new Store();

const path = require("path");

let window;

function getStorableWindowProps(window) {
    const [width, height] = window.getSize();
    return { width, height, fullscreen: window.isFullScreen() || undefined };
}

function createWindow() {
    const windowProps = store.get('window');
    window = new BrowserWindow({ autoHideMenuBar: true, maximizable: false, ...windowProps,
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
       }
    });
    window.loadURL(`file://${path.join(__dirname, "app/index.html")}`);

    const saveWindowProps = () => store.set('window', getStorableWindowProps(window));

    window.on("resize", saveWindowProps);
    window.on("enter-full-screen", saveWindowProps);
    window.on("leave-full-screen", saveWindowProps);
    window.on("closed", () => window = null);

    ipcMain.on('game-event', (event, args) => activateAchievement(args[0]))
}

app.on("ready", createWindow);

app.on("window-all-closed", () => app.quit());

app.on("activate", () => {
    if (window === null)
        createWindow();
});

const steamworks = require('steamworks.js')
const client = steamworks.init(2365560);

const achievementNames = [ 'defeatDesertBoss', 'defeatJungleBoss', 'defeatVolcanoBoss', 'defeatFinalBoss', 'completeGame' ];

function activateAchievement(name) {
    if (!achievementNames.includes(name))
        return console.error(`Attempting to activate invalid achievement:`, name);

    console.log(`Attempting to activate achievement:`, name)
    client.achievement.activate(name);
    client.stats.store();
}