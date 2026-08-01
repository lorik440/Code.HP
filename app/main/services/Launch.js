const { log } = require("./Logger.js");

function tryShowMainWindow(kernel) {

    if (!kernel.context.updateFinished || !kernel.context.editorReady) {
        return;
    }

    const splash = kernel.context.splashWindow;
    const win = kernel.context.mainWindow;

    if (splash && !splash.isDestroyed()) {
        splash.close();
    }

    if (win && !win.isDestroyed()) {

        if (!win.isVisible()) {
            win.show();
        }

        if (win.isMinimized()) {
            win.restore();
        }

        win.focus();

    }

}

module.exports = tryShowMainWindow;
