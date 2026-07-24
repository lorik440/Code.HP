import {
    app,
    BrowserWindow,
    globalShortcut,
    ipcMain
} from "electron";

import electronUpdater from "electron-updater";

const { autoUpdater } = electronUpdater;

import path from "path";
import fs from "fs";

export {
    app,
    BrowserWindow,
    globalShortcut,
    ipcMain,
    autoUpdater,
    path,
    fs
};