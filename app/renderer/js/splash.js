
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

let currentSpinner = null;

ipcRenderer.on("splash-message", (_, message) => {

    // Remove spinner from previous line
    if (currentSpinner) {
        currentSpinner.remove();
    }

    // Create a new line
    const line = document.createElement("div");
    line.className = "terminal-line";

    // Message
    const text = document.createElement("span");
    text.textContent = `> ${message}`;

    // Spinner
    const spinner = document.createElement("span");
    spinner.className = "spinner";

    line.appendChild(text);
    line.appendChild(spinner);

    output.appendChild(line);

    currentSpinner = spinner;

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
