import {
    ipcRenderer,
} from "../../../main/deps/render-deps.js"

ipcRenderer.send("splash-message", { message: "splash window", status: "loading", step: "splash" });

(() => {

async function loadAppVersion() {
    const version = await ipcRenderer.invoke("get-app-version");
    document.getElementById("appVersion").textContent = version;
}
loadAppVersion();

const output = document.getElementById("terminal-output");
const stepLines = new Map();

const frames = ["⠋","⠙","⠹","⠸","⠼","⠴","⠦","⠧","⠇","⠏"];
let frameIndex = 0;

setInterval(() => {
    document.querySelectorAll(".spinner").forEach(s => {
        s.textContent = frames[frameIndex];
    });
    frameIndex = (frameIndex + 1) % frames.length;
}, 50);

ipcRenderer.on("splash-message", (_, msg) => {

    const step = msg.step || null;
    const status = msg.status || "loading";
    const message = msg.message || msg;

    if (step && stepLines.has(step)) {

        const entry = stepLines.get(step);

        if (status !== "loading") {
            entry.status.textContent = status === "success" ? "[SUCCESS]" : `[${status}]`;
            entry.status.classList.remove("hidden");
            entry.spinner.remove();
        } else {
            entry.text.textContent = message;
        }

    } else {

        const line = document.createElement("div");
        line.className = "terminal-line";
        line.textContent = "> ";

        const statusEl = document.createElement("span");
        statusEl.className = "status hidden";
        statusEl.textContent = "[SUCCESS]";

        const text = document.createElement("span");
        text.textContent = message;

        const spinner = document.createElement("span");
        spinner.className = "spinner";

        line.appendChild(statusEl);
        line.appendChild(text);

        if (status === "loading") {
            line.appendChild(spinner);
        }
        if (status !== "loading") {
            statusEl.classList.remove("hidden");
        }

        output.appendChild(line);

        if (step) {
            stepLines.set(step, { status: statusEl, spinner, text });
        }

        output.scrollTop = output.scrollHeight;
    }

});

})();
