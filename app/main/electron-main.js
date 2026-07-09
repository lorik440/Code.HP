// window operations
const path = require('path');
const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const fs = require('fs');

let win;
let splash;

function createSplash() {
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
        icon: path.join(__dirname, "..", "assets", "icon.ico"),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    splash.loadFile(path.join(__dirname, "..", "renderer", "splash.html"));
}

function createWindow() {
    win = new BrowserWindow({
        width: 500,
        height: 400,
        minWidth: 480,
        minHeight: 380,
        show: false,
        icon: path.join(__dirname, "..", "assets", "icon.ico"),
        alwaysOnTop: true,
        autoHideMenuBar: true,
        resizable: true,
        backgroundColor: "#121715",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: true,
            allowRunningInsecureContent: false,
        }
    });

    win.loadFile(path.join(__dirname, "..", "renderer", "index.html"));

    ipcMain.once("editor-ready", ()=> {
        if(splash && !splash.isDestroyed()){
            splash.close();
        }
        win.show();
        win.focus();
    })
}

app.whenReady().then(() => {

    global.snippetsDir = path.join(app.getPath("userData"), "snippets");

    if (!fs.existsSync(global.snippetsDir)) {
        fs.mkdirSync(global.snippetsDir, { recursive: true });
    }

    ipcMain.handle("get-snippets-dir", () => global.snippetsDir);

    createSplash();
    createWindow();

    const registered = globalShortcut.register("Ctrl+Alt+Space", () => {

        if (!win || win.isDestroyed()) {
            return;
        }

        if (splash && !splash.isDestroyed()) {
            return;
        }

        if (win.isVisible()) {
            win.hide();
        } else {
            win.show();
            win.focus();
        }

    });

    if (!registered) {
        console.warn("Global shortcut registration failed.");
    }

});

app.on("will-quit", () => {
    globalShortcut.unregisterAll();
});