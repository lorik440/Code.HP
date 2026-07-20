ipcRenderer.send("splash-message","loader.js");

import{
    nodeRequire,
    path,
    fs,
    ipcRenderer
}from "../../main/electron-deps.js"

(() => {

function loadComponents(containerId, fileName) {

    const filepath = path.join( __dirname,"html-components",fileName );

    if (!fs.existsSync(filepath)) {
        console.log('File not found:', filepath);
        return;
    }

    const html = fs.readFileSync(filepath, "utf8");

    const container = document.getElementById(containerId);


    if (!container) {
        console.log(
            `Container "${containerId}" not found`
        );
        return;
    }

    container.innerHTML = html;
    console.log('Component loaded successfully');
}

//loading the html components
document.addEventListener("DOMContentLoaded", () => {

    loadComponents("sidebar", "sidebar.html");
    ipcRenderer.send("splash-message","sidebar");

    loadComponents("topMainPanel", "top-main-panel.html");
    ipcRenderer.send("splash-message","top main panel");

    loadComponents("addSnippetPanel", "add-snippet-panel.html");
    ipcRenderer.send("splash-message","add snippet panel");

    loadComponents("options", "language-options.html");
    ipcRenderer.send("splash-message","language options");

    loadComponents("editorPanel", "editor-panel.html");
    ipcRenderer.send("splash-message","editor panel");

    

});

})();
