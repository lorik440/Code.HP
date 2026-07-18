console.log("electron-main.js loaded");
// window operations
const { app, BrowserWindow, globalShortcut, ipcMain } = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("path");
const fs = require("fs");

let win;
let splash;

let updateFinished = false;
let editorReady = false;



// =======================================================
// SHOW MAIN WINDOW WHEN EVERYTHING IS READY
// =======================================================

function tryShowMainWindow() {
    
    if (!updateFinished || !editorReady) {
        return;
    }

    if (splash && !splash.isDestroyed()) {
        splash.close();
    }

    if (win && !win.isDestroyed()) {
        win.show();
        win.focus();
    }

}

// =======================================================
// SPLASH
// =======================================================

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

    return splash.loadFile(
        path.join(__dirname, "..", "renderer", "splash.html")
    );

}

// =======================================================
// MAIN WINDOW
// =======================================================

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
            allowRunningInsecureContent: false
        }
    });

    win.loadFile(
        path.join(__dirname, "..", "renderer", "index.html")
    );

    ipcMain.once("editor-ready", () => {

        console.log("Renderer is ready.");

        editorReady = true;

        tryShowMainWindow();

    });

}

// =======================================================
// SPLASH STATUS
// =======================================================

ipcMain.on("splash-message", (_event, message) => {

    console.log("[MAIN] Forwarding:", message);

    if (splash && !splash.isDestroyed()) {
        splash.webContents.send("splash-message", message);
    }

});

function sendSplashMessage(message) {

    if (!splash || splash.isDestroyed()) return;

    splash.webContents.send("splash-message", message);

}

// =======================================================
// AUTO UPDATER
// =======================================================

autoUpdater.on("checking-for-update", () => {

    console.log("Checking for updates");

    sendSplashMessage("Checking for updates");

});

autoUpdater.on("update-available", (info) => {

    console.log("Update available:", info.version);

    updateFinished = false;

    sendSplashMessage(
        `Downloading update ${info.version}`
    );

});

autoUpdater.on("download-progress", (progress) => {

    console.log(
        `Downloading ${Math.round(progress.percent)}`
    );

   sendSplashMessage(
        `Downloading ${Math.round(progress.percent)}`
    );

});

autoUpdater.on("update-downloaded", () => {

    console.log("Update downloaded");

    sendSplashMessage(
        "Installing update"
    );

    setTimeout(() => {

        autoUpdater.quitAndInstall();

    }, 1000);

});

autoUpdater.on("update-not-available", () => {

    console.log("No update available");

    updateFinished = true;

    sendSplashMessage(
        "Starting Code.HP..."
    );

    tryShowMainWindow();

});

autoUpdater.on("error", (err) => {

    console.error("Updater error:", err);

    updateFinished = true;

    sendSplashMessage(
        "Starting Code.HP..."
    );

    tryShowMainWindow();

});

// =======================================================
// APP START
// =======================================================
ipcMain.handle("get-app-version", () => {
    return app.getVersion();
});

app.whenReady().then(async () => {

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

    await createSplash();
    
    createWindow();

    if (app.isPackaged) {

        console.log("Production mode");

        autoUpdater.setFeedURL({
            provider: 'github',
            owner: 'lorik440',
            repo: 'Code.HP'
        });

        autoUpdater.checkForUpdates();

    } else {

        console.log("Development mode");

        updateFinished = true;

        sendSplashMessage(
            "Development mode"
        );

        tryShowMainWindow();

    }

    // Fallback after 30 seconds

    setTimeout(() => {

        if (!updateFinished) {

            console.log(
                "Updater timeout"
            );

            updateFinished = true;

            sendSplashMessage(
                "Starting Code.HP..."
            );

            tryShowMainWindow();

        }

    }, 30000);


    const registered = globalShortcut.register(
        "Ctrl+Alt+Space",
        () => {

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

        }
    );

    if (!registered) {

        console.warn(
            "Global shortcut registration failed."
        );

    }

});

app.on("will-quit", () => {

    globalShortcut.unregisterAll();

});