// window operations
const path = require('path');
const electron = require('electron');
// Only use electron-reload in development
if (process.env.NODE_ENV !== 'production') {
    try {
        require('electron-reload')(__dirname);
    } catch (e) {
        // electron-reload not available in production
    }
}

const {app, BrowserWindow, globalShortcut, ipcMain} = require('electron');

const fs = require('fs');

let win;

function createWindow(){
    win = new BrowserWindow({
        width: 500,
        height: 400,
        minWidth: 480,
        minHeight: 380,
        icon: path.join(__dirname, '..', 'assets', 'icon.ico'),
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

    win.loadFile(path.join(__dirname, '..', 'renderer', 'index.html'));
        
}

app.whenReady().then(() => {

    global.snippetsDir = path.join(app.getPath('userData'), 'snippets');
    if (!fs.existsSync(global.snippetsDir)) {
        fs.mkdirSync(global.snippetsDir, { recursive: true });
    }

    ipcMain.handle('get-snippets-dir', () => global.snippetsDir);

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