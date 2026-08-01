const { app, BrowserWindow, globalShortcut, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

module.exports = { app, BrowserWindow, globalShortcut, ipcMain, path, fs };
