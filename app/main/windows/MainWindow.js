const { BrowserWindow, ipcMain, path } = require("../deps/electron.deps.js");

function createWindow(kernel, resolve) {

    const win = new BrowserWindow({
        width: 500,
        height: 400,
        minWidth: 480,
        minHeight: 380,
        show: false,
        icon: path.join(__dirname, "..", "..", "assets", "icons","AppLogo.ico"),
        alwaysOnTop: true,
        autoHideMenuBar: true,
        resizable: true,
        backgroundColor: "#121715",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false,
            allowRunningInsecureContent: false
        }
    });

    kernel.context.mainWindow = win;

    win.loadFile(
        path.join(__dirname, "..", "..", "renderer", "mainWindow", "mainWindow.html")
    );

    ipcMain.once("editor-ready", () => {
        kernel.context.editorReady = true;
        kernel.tryShow();
        resolve();
    });

}

module.exports = createWindow;
