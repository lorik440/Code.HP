const { app, globalShortcut } = require("./deps/electron.deps.js");

const Kernel = require("./Kernel.js");
const { log } = require("./services/Logger.js");

app.whenReady().then(async () => {
    log("starting kernel");
    Kernel.start();
});

app.on("will-quit", () => {
    globalShortcut.unregisterAll();
});
