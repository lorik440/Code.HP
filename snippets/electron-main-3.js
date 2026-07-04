// window operations
const electron = require('electron');
require('electron-reload')(__dirname);

const {app, BrowserWindow, globalShortcut} = require('electron');

let win;

function createWindow(){
    win = new BrowserWindow({
        width: 500,
        height: 400,
        minWidth: 480,
        minHeight: 380,
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