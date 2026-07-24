console.log("electron-main.js loaded");

const { app, ipcMain } = require("electron");

const kernel = require("./electron/kernel");

const splash = require("./windows/SplashWindow");
const mainWindow = require("./windows/MainWindow");
const updater = require("./services/Updater");
const storage = require("./services/Storage");


ipcMain.handle(
    "get-app-version",
    () => app.getVersion()
);


app.whenReady().then(async()=>{


    kernel.initialize({

        splash,
        mainWindow,
        updater,
        storage

    });


    await kernel.boot();


});


app.on("will-quit",()=>{

    mainWindow.unregisterShortcut();

});