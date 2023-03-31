const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronApi', {
    onGameEvent: (event) => ipcRenderer.send('game-event', [ event ]),
});
