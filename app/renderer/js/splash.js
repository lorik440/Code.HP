console.log("splash loaded");
(() => {
const nodeRequire = window.nodeRequire || window.require || require;
const { ipcRenderer } = nodeRequire("electron");
const status = document.getElementById("update-status");

ipcRenderer.on("update-status", (_event, message) => {
    status.innerText = message;
});

ipcRenderer.on("app-log", (_event, message) => {
    logQueue.push(message);
    processLogQueue();
});



})();
