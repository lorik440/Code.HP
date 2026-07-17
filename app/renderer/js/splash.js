console.log("splash loaded");

import {
    nodeRequire,
    ipcRenderer,
    

}from "../../main/electron-deps.js"
(() => {

// Load the application version and display it in the UI
async function loadAppVersion() {
    const version = await ipcRenderer.invoke("get-app-version");
    document.getElementById("appVersion").textContent = version;
}
loadAppVersion();

//get update status
const status = document.getElementById("update-status");

ipcRenderer.on("update-status", (_event, message) => {
    status.innerText = message;
});

//unfinished featur 
ipcRenderer.on("app-log", (_event, message) => {
    logQueue.push(message);
    processLogQueue();
});

const frames = [
    "⠋","⠙","⠹","⠸",
    "⠼","⠴","⠦","⠧",
    "⠇","⠏"
];

let i = 0;

setInterval(() => {
    document.getElementById("spinner").textContent = frames[i];
    i = (i + 1) % frames.length;
}, 50);



})();
