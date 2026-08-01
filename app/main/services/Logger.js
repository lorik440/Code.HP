let splashWindow = null;

function setSplashWindow(window) {
    splashWindow = window;
}

function log(message, status = "loading", step = null) {
    const logMessage = {
        message,
        status,
        step,
        timeStamp: new Date().toLocaleTimeString()
    };

    console.log(
        `>> [${status.toUpperCase()}] ${message} - ${logMessage.timeStamp}`
    );

    if (splashWindow && !splashWindow.isDestroyed()) {
        splashWindow.webContents.send("splash-message", logMessage);
    }
}

module.exports = { setSplashWindow, log };
