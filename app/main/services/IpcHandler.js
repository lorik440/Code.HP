const { app, ipcMain } = require("../deps/electron.deps.js");
const { pathToFileURL } = require("url");
const path = require("path");

function getAppVersion() {
    ipcMain.handle("get-app-version", () => {
        return app.getVersion();
    });
}

function getMonacoBaseUrl() {
    ipcMain.handle("get-monaco-base-url", () => {
        const monacoPath = path.join(app.getAppPath(), "node_modules", "monaco-editor", "min", "vs");
        return pathToFileURL(monacoPath).href + "/";
    });
}

module.exports = { getAppVersion, getMonacoBaseUrl };
