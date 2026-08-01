const { BrowserWindow, ipcMain } = require("electron");
const path = require("path");

function createWindow(kernel, resolve) {

    const win = new BrowserWindow({
        width: 500,
        height: 400,
        minWidth: 480,
        minHeight: 380,
        show: false,
        icon: path.join(__dirname, "..", "..", "assets", "icon.ico"),
        alwaysOnTop: true,
        autoHideMenuBar: true,
        resizable: true,
        backgroundColor: "#121715",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: true,
            allowRunningInsecureContent: false
        }
    });

    kernel.context.mainWindow = win;

    win.loadFile(
        path.join(__dirname, "..",".." ,"renderer", "index.html")
    );

    ipcMain.once("editor-ready", () => {
        kernel.context.editorReady = true; 
        kernel.tryShow();
        resolve();
    });

}

module.exports = createWindow;