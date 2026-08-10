const { app } = require("../deps/electron.deps.js");
const { log } = require("./Logger.js");

function updater(kernel, resolve) {
    const { autoUpdater } = require("electron-updater");

    if (!app.isPackaged) {
        kernel.context.updateFinished = true;
        log("development mode 'skipping updates'", "success", "updates");
        resolve();
        kernel.tryShow();
        return;
    }

    const timeout = setTimeout(() => {
        kernel.context.updateFinished = true;
        log("update check timed out", "failed", "updates");
        resolve();
        kernel.tryShow();
    }, 30000);

    autoUpdater.once("checking-for-update", () => {
    });

    autoUpdater.once("update-available", (info) => {
        clearTimeout(timeout);
        kernel.context.updateFinished = false;
        log(`update available — v${info.version}`, "loading", "updates");
        autioUpdater.downloadUpdate();
    });

    autoUpdater.on("download-progress", (progress) => {
        log(`downloading — ${Math.round(progress.percent)}%`, "loading", "updates");
    });

    autoUpdater.once("update-downloaded", () => {
        log("installing update", "success", "updates");
        setTimeout(() => {
            autoUpdater.quitAndInstall();
            resolve();
        }, 1000);
    });

    autoUpdater.once("update-not-available", () => {
        clearTimeout(timeout);
        kernel.context.updateFinished = true;
        log("up to date", "success", "updates");
        resolve();
        kernel.tryShow();
    });

    autoUpdater.once("error", (err) => {
        clearTimeout(timeout);
        kernel.context.updateFinished = true;
        log(`updater error — ${err.message}`, "failed", "updates");
        resolve();
        kernel.tryShow();
    });

    autoUpdater.setFeedURL({
        provider: "github",
        owner: "lorik440",
        repo: "Code.HP"
    });

    autoUpdater.checkForUpdates();
}

module.exports = updater;
