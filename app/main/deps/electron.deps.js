const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const fs = require('fs');

module.exports = {
    app,
    BrowserWindow,
    globalShortcut,
    ipcMain,
    autoUpdater,
    path,
    fs
};