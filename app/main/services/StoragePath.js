const path = require("path");
const fs = require("fs");
const { app, ipcMain } = require("electron");

function setStoragePath(){

    global.snippetsDir = path.join(
        app.getPath("userData"),
        "snippets"
    );

    if (!fs.existsSync(global.snippetsDir)) {

        fs.mkdirSync(
            global.snippetsDir,
            { recursive: true }
        );

    }

    ipcMain.handle(
        "get-snippets-dir",
        () => global.snippetsDir
    );
}

module.exports= setStoragePath;
 