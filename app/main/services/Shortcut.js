const { globalShortcut } = require("../deps/electron.deps.js");

function setShortcut(kernel) {

    globalShortcut.register("Ctrl+Alt+Space", () => {

        if (!kernel.context.mainWindow || kernel.context.mainWindow.isDestroyed()) {
            return;
        }

        if (kernel.context.splashWindow && !kernel.context.splashWindow.isDestroyed()) {
            return;
        }

        if (kernel.context.mainWindow.isVisible()) {
            kernel.context.mainWindow.hide();
        } else {
            kernel.context.mainWindow.show();
            kernel.context.mainWindow.focus();
        }

    });
}

module.exports = setShortcut;
