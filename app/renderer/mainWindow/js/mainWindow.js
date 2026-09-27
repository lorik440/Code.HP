// main window

// import necessary moduals
import {path, ipcRenderer, fs} from "../../../main/deps/render-deps.js"

import {startMonacoEditor, zoomIn, zoomOut, getMonacoLanguage, hideEditorView, copyCode} from "./monaco-editor.js";

import {addSnippetMode, deleteSnippet, defaultsnippetmode, saveSnippet} from "./snippetLogic.js";

import {showAlert, showToast} from "./alerts.js"

(() => {

// create the snippet directory path and save it to a variable
let snippetsDir;

async function initSnippetsDir() {
    snippetsDir = await ipcRenderer.invoke('get-snippets-dir');
}

// get the app version form electron and renderes it to the monaco edditor panel 
async function loadAppVersion() {
    const version = await ipcRenderer.invoke("get-app-version");
    document.getElementById("appVersion").textContent = version;
}

// Initializes the snippet management interface by loading saved snippets,
// generating their tabs, handling snippet selection and search, and
// registering event handlers for snippet management and editor controls.
document.addEventListener('DOMContentLoaded', async () => {

    // render app version in to the monaco editor 
    loadAppVersion();

    // wait for the snippets direcotry to be fully loaded 
    await initSnippetsDir();

    // Read the snippet files from the snippets directory and parse their names to extract metadata
    const files = fs.readdirSync(snippetsDir);

    const snippets = files.map(filename => {
        const parsed = path.parse(filename);
        const parts = parsed.name.split('-');
        const id = parts[parts.length - 1];
        const name = parts.slice(0, -1).join('-');
        return {
            id: parseInt(id),
            name: name,
            language: parsed.ext.slice(1)
        }
    });
    
    // render all snippets in to the tab space 
    const tabSpace = document.getElementById('tabSpace');

    // tab html body, pupulated with the tab info for every snippet file
    const tabsHTML = snippets.map(snip => `
        <div class="tab" data-id="${snip.id}">
            <span class="snippetName">${snip.name}</span> 
            <span class="snippetLanguage">${snip.language}</span>
        </div>
    `).join('');

    tabSpace.innerHTML = tabsHTML;
    
    // Add event listener to handle tab clicks, which will load the corresponding snippet into the editor
    tabSpace.addEventListener('click', (e) => {

        // fetch the tab html element that was clicked and if it is not a tab then return
        const tab = e.target.closest(".tab");
        if (!tab) return;

        // set the editor view to be hidden and set the default snippet mode  
        hideEditorView();
        defaultsnippetmode();

        // remove the active class from all tabs and add it to the clicked tab
        document.querySelectorAll('.tab.active')
            .forEach(t => t.classList.remove('active'));

        tab.classList.add('active');

        // fetch the necessary snippet data from the clicked tab and read the corresponding file content
        const snippetId = parseInt(tab.dataset.id);
        const snippet = snippets.find(s => s.id === snippetId);
        const fileName = `${snippet.name}-${snippet.id}.${snippet.language}`;
        const filePath = path.join(snippetsDir, fileName);
        const fileContent = fs.readFileSync(filePath, 'utf8');

        // render the snippet name and language from the active tab
        document.getElementById("snippetName_TMP").textContent = snippet.name;
        document.getElementById("language_TMP").textContent = snippet.language;

        // set monaco editor value and language type to the content of the file selected in the tab
        window.editor.setValue(fileContent);
        monaco.editor.setModelLanguage(window.editor.getModel(), getMonacoLanguage(snippet.language));
    });

    // Add event listener to the search bar to filter tabs based on user input
    const tabs = document.querySelectorAll('.tab');
    const searchBar = document.getElementById("SearchSnippet");
    searchBar.addEventListener("input", () => {
        const searchBarInput = searchBar.value.toLowerCase();
        tabs.forEach(tab => {
            const snippetName = tab.querySelector(".snippetName").textContent.toLowerCase();
            tab.style.display = (searchBarInput === "" || snippetName.includes(searchBarInput)) ? "" : "none";
        });
    });

    // get the html elements for the add, save, delete, copy, zoom in out, buttons and store them in variables 
    const addSnippetBtn = document.getElementById("addSnippet");
    const saveSnippetBtn = document.getElementById("saveSnippet");
    const deleteBtn = document.getElementById("deleteSnippetBtn");
    const copyBtn = document.getElementById("copyCodeBtn");
    const zoomOutBtn = document.getElementById("zoomOutBtn");
    const zoomInBtn = document.getElementById("zoomInBtn");

    // add eventlisteners to the buttons in the snippet management interface for adding, saving, deleting, copying, and zooming in/out of snippet
    if (addSnippetBtn) addSnippetBtn.addEventListener("click", () => { addSnippetMode(); hideEditorView(); });
    if (saveSnippetBtn) saveSnippetBtn.addEventListener("click", () => saveSnippet(snippetsDir));
    // when deleting a snippet the user will be prompted with a clickable alert to confirm deletion of selected snippet from the directory
        if (deleteBtn) deleteBtn.addEventListener("click", () => showAlert("Continue to delete snippet: right click to cancel", ()=>deleteSnippet(snippetsDir)));
    if (copyBtn) copyBtn.addEventListener("click", () => copyCode());
    if (zoomOutBtn) zoomOutBtn.addEventListener("click", () => zoomOut());
    if (zoomInBtn) zoomInBtn.addEventListener("click", () => zoomIn());

    // store the dropdown menu for the language selection and the input field in variables
    const input = document.querySelector(".dropdown input");
    const options = document.querySelector('.options');

    // add event listener to the dropdown menu to handle language selection changes
    options.addEventListener('mousedown', (e) => {

        // fetch the value of the clicked language option
        const option = e.target.closest('.option');
        if (!option) return;
        input.value = option.textContent;
        input.dataset.value = option.dataset.value;
        input.blur();

        // set monaco editor language to the language selected in the dropdown menu
        monaco.editor.setModelLanguage(window.editor.getModel(), getMonacoLanguage(option.dataset.value));
    });
});

// start the monaco editor after the DOM in loaded 
startMonacoEditor(() => {

    // notify kerknel to start the mainwindow 
    ipcRenderer.send("editor-ready");
});

})();
