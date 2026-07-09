const { ipcRenderer } = require("electron");

const status = document.getElementById("update-status");

ipcRenderer.on("update-status", (event, message) => {
    status.innerText = message;
});