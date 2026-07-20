
ipcRenderer.send("splash-message","splash window");

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

//terminal message 
const output = document.getElementById("terminal-output");

let currentStatus = null;
let currSpinner =null;


ipcRenderer.on("splash-message", (_, message) => {

    // Show OK on the previous message
    if (currentStatus) {
        currentStatus.classList.remove("hidden");
    }

    if(currSpinner){
        currSpinner.remove();
    }

    const line = document.createElement("div");
    line.className = "terminal-line";
    line.textContent="> ";

    // Create status
    const status = document.createElement("span");
    status.className = "status hidden";
    status.textContent = "[OK]";

    // Create message
    const text = document.createElement("span");
    text.textContent = message;

    //create the spinner
    const spinner =document.createElement("span");
    spinner.className ="spinner";

    line.appendChild(status);
    line.appendChild(text);
    line.appendChild(spinner);

    output.appendChild(line);

    // Keep reference to current status
    currentStatus = status;
    currSpinner=spinner;

    output.scrollTop = output.scrollHeight;

});


//spinner 
const frames = [
    "⠋","⠙","⠹","⠸",
    "⠼","⠴","⠦","⠧",
    "⠇","⠏"
];

let i = 0;

setInterval(() => {
    document.querySelector(".spinner").textContent = frames[i];
    i = (i + 1) % frames.length;
}, 50);



})();
