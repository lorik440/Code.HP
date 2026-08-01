const { BrowserWindow } = require("electron");
const path = require("path");

async function createSplash() {

    splash = new BrowserWindow({
        width: 400,
        height: 300,
        frame: false,
        resizable: false,
        minimizable: false,
        maximizable: false,
        movable: true,
        alwaysOnTop: true,
        autoHideMenuBar: true,
        backgroundColor: "#121715",
        icon: path.join(__dirname, "..","..", "assets", "icon.ico"),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    await splash.loadFile(
        path.join(__dirname, "..","..", "renderer", "splash.html")
    );

    return splash;

}

module.exports= createSplash