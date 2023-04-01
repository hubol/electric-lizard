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

const lizardConfig = require('./lizard.json');

if (!lizardConfig.steamworksAppId)
    throw new Error(`Missing steamworksAppId in lizard.json!`);

const steamworks = require('steamworks.js');
let steamworksClient;

function tryCreateSteamworksClient() {
    if (steamworksClient) {
        console.info(`Steamworks client already exists. Not recreating.`);
        return;
    }
    try {
        steamworksClient = steamworks.init(Number(lizardConfig.steamworksAppId));
    }
    catch (e) {
        console.info(`An error occurred while creating the steamworks client`, e);
    }
}

tryCreateSteamworksClient();

function activateAchievement(name, retryTimeoutMs = 1000) {
    console.log(`Attempting to activate achievement:`, name, `...`);
    try {
        const achievementActivateResult = steamworksClient.achievement.activate(name);
        console.log(`steamworksClient.achievement.activate("${name}") returned`, achievementActivateResult);
        if (!achievementActivateResult)
            throw new Error(`steamworksClient.achievement.activate("${name}") returned ${achievementActivateResult}`);
    }
    catch (e) {
        console.info(`An error occurred while activating the achievement with name=${name}`, e);
        console.info(`Trying to create steamworks client...`);
        tryCreateSteamworksClient();
        console.info(`Retrying activateAchievement(${name}) in ${retryTimeoutMs}ms...`);
        setTimeout(() => activateAchievement(name, Math.min(15_000, retryTimeoutMs * 2)), retryTimeoutMs);
    }
}