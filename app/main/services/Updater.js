const { autoUpdater } = require("electron-updater");
const { app } = require("electron");
class Updater {

    async check(splash) {

        return new Promise((resolve, reject) => {

            if(!app.isPackaged){
                splash.sendMessage(
                    "Development mode",
                    "success"
                )
                resolve();
                return;
            }

            autoUpdater.setFeedURL({
                provider: "github",
                owner: "lorik440",
                repo: "Code.HP"
            });

            autoUpdater.on("checking-for-update", () => {

                splash.sendMessage(
                    "Checking for updates",
                    "loading"
                );

            });

            autoUpdater.on("update-available", (info) => {

                splash.sendMessage(
                    `Downloading update ${info.version}`,
                    "loading"
                );

            });

            autoUpdater.on("download-progress", (progress) => {

                splash.sendMessage(
                    `Downloading ${Math.round(progress.percent)}%`,
                    "loading"
                );

            });

            autoUpdater.on("update-downloaded", () => {

                splash.sendMessage(
                    "Installing update",
                    "success"
                );

                setTimeout(() => {

                    autoUpdater.quitAndInstall();

                }, 1000);

            });

            autoUpdater.on("update-not-available", () => {

                splash.sendMessage(
                    "Code.HP is up to date",
                    "success"
                );

                resolve();

            });

            autoUpdater.on("error", (err) => {

                splash.sendMessage(
                    "Update failed, starting app",
                    "failed"
                );

                reject(err);

            });

            autoUpdater.checkForUpdates();

        });

    }

}

module.exports = new Updater();