const { log } = require("./Logger.js");
const { app } = require("electron");

function updater(kernel, resolve){
    const { autoUpdater } = require("electron-updater");

    autoUpdater.on("checking-for-update", () => {
        log("checking for updates", "loading", "updates");
    });

    autoUpdater.on("update-available", (info) => {
        kernel.context.updateFinished = false;
        log(`update available — v${info.version}`, "loading", "updates");
    });

    autoUpdater.on("download-progress", (progress) => {
        log(`downloading update — ${Math.round(progress.percent)}`, "loading", "updates");
    });

    autoUpdater.on("update-downloaded", () => {
        log("update downloaded — installing", "success", "updates");
        setTimeout(() => {
            autoUpdater.quitAndInstall();
            resolve();
        }, 1000);
    });

    autoUpdater.on("update-not-available", () => {
        kernel.context.updateFinished = true;
        log("up to date", "success", "updates");
        resolve();
        kernel.tryShow();
    });

    autoUpdater.on("error", (err) => {
        kernel.context.updateFinished = true;
        log(`updater error — ${err.message}`, "failed", "updates");
        kernel.tryShow();
        resolve();
    });

    if (app.isPackaged) {
    
        console.log("Production mode");

        autoUpdater.setFeedURL({
            provider: 'github',
            owner: 'lorik440',
            repo: 'Code.HP'
        });

        autoUpdater.checkForUpdates();

    } else {

        kernel.context.updateFinished = true;
        log("development mode — skipping updates", "success", "updates");
        kernel.tryShow();
        resolve();
    }
}

module.exports =updater;