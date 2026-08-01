const { app, ipcMain, path, fs } = require("../deps/electron.deps.js");

function setStoragePath() {

    global.snippetsDir = path.join(
        app.getPath("userData"),
        "snippets"
    );

    if (!fs.existsSync(global.snippetsDir)) {
        fs.mkdirSync(global.snippetsDir, { recursive: true });
    }

    ipcMain.handle(
        "get-snippets-dir",
        () => global.snippetsDir
    );
}

module.exports = setStoragePath;
