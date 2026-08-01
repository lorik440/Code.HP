const { app, ipcMain } = require("../deps/electron.deps.js");

function getAppVersion() {
    ipcMain.handle("get-app-version", () => {
        return app.getVersion();
    });
}

module.exports = { getAppVersion };
