console.log('Loading components...');

import{
    nodeRequire,
    path,
    fs
}from "../../main/electron-deps.js"

(() => {

function loadComponents(containerId, fileName) {

    const filepath = path.join( __dirname,"html-components",fileName );
   
    console.log('Loading component:', filepath);

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
   

    loadComponents("topMainPanel", "top-main-panel.html");
   

    loadComponents("addSnippetPanel", "add-snippet-panel.html");


    loadComponents("options", "language-options.html");


    loadComponents("editorPanel", "editor-panel.html");
    

});

})();
