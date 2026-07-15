console.log("splash loaded");

import {
    nodeRequire,
    ipcRenderer,
    

}from "../../main/electron-deps.js"
(() => {
const status = document.getElementById("update-status");

ipcRenderer.on("update-status", (_event, message) => {
    status.innerText = message;
});

ipcRenderer.on("app-log", (_event, message) => {
    logQueue.push(message);
    processLogQueue();
});



})();
