// window operations
const electron = require('electron');
// Only use electron-reload in development
if (process.env.NODE_ENV !== 'production') {
    try {
        require('electron-reload')(__dirname);
    } catch (e) {
        // electron-reload not available in production
    }
}

const {app, BrowserWindow, globalShortcut} = require('electron');

let win;

function createWindow(){
    win = new BrowserWindow({
        width: 500,
        height: 400,
        minWidth: 480,
        minHeight: 380,
        icon: `${__dirname}/icon.ico`,
        alwaysOnTop: true,
        autoHideMenuBar: true,
        resizable: true,
        webPreferences:{
            nodeIntegration:true,
            contextIsolation:false,
            webSecurity: false,  
            allowRunningInsecureContent: true
        }
    });

    win.loadFile('index.html');
        
}

app.whenReady().then(() => {
    createWindow();

    const registered = globalShortcut.register('Ctrl+S', () => {
        if (!win || win.isDestroyed()) {
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
        console.warn('Global shortcut registration failed.');
    }
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});