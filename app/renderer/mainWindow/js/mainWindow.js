import {
    path,
    ipcRenderer,
    fs
} from "../../../main/deps/render-deps.js"

import {
    startMonacoEditor,
    zoomIn,
    zoomOut,
    getMonacoLanguage,
    hideEditorView,
    copyCode
} from "./monaco-editor.js";

import {
    addSnippetMode,
    deleteSnippet,
    defaultsnippetmode,
    saveSnippet
}from "./snippetLogic.js";

import {
    showAlert,
    showToast
}from "./alerts.js"

(() => {

let snippetsDir;

async function initSnippetsDir() {
    snippetsDir = await ipcRenderer.invoke('get-snippets-dir');
}

async function loadAppVersion() {
    const version = await ipcRenderer.invoke("get-app-version");
    document.getElementById("appVersion").textContent = version;
}

document.addEventListener('DOMContentLoaded', async () => {

    loadAppVersion();
    await initSnippetsDir();

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

    const tabSpace = document.getElementById('tabSpace');

    const tabsHTML = snippets.map(snip => `
        <div class="tab" data-id="${snip.id}">
            <span class="snippetName">${snip.name}</span> 
            <span class="snippetLanguage">${snip.language}</span>
        </div>
    `).join('');

    tabSpace.innerHTML = tabsHTML;

    tabSpace.addEventListener('click', (e) => {
        const tab = e.target.closest(".tab");
        if (!tab) return;

        hideEditorView();
        defaultsnippetmode();

        document.querySelectorAll('.tab.active')
            .forEach(t => t.classList.remove('active'));

        tab.classList.add('active');

        const snippetId = parseInt(tab.dataset.id);
        const snippet = snippets.find(s => s.id === snippetId);
        const fileName = `${snippet.name}-${snippet.id}.${snippet.language}`;
        const filePath = path.join(snippetsDir, fileName);
        const fileContent = fs.readFileSync(filePath, 'utf8');

        document.getElementById("snippetName_TMP").textContent = snippet.name;
        document.getElementById("language_TMP").textContent = snippet.language;

        window.editor.setValue(fileContent);
        monaco.editor.setModelLanguage(window.editor.getModel(), getMonacoLanguage(snippet.language));
    });

    const tabs = document.querySelectorAll('.tab');
    const searchBar = document.getElementById("SearchSnippet");
    searchBar.addEventListener("input", () => {
        const searchBarInput = searchBar.value.toLowerCase();
        tabs.forEach(tab => {
            const snippetName = tab.querySelector(".snippetName").textContent.toLowerCase();
            tab.style.display = (searchBarInput === "" || snippetName.includes(searchBarInput)) ? "" : "none";
        });
    });

    const addSnippetBtn = document.getElementById("addSnippet");
    const saveSnippetBtn = document.getElementById("saveSnippet");
    const deleteBtn = document.getElementById("deleteSnippetBtn");
    const copyBtn = document.getElementById("copyCodeBtn");
    const zoomOutBtn = document.getElementById("zoomOutBtn");
    const zoomInBtn = document.getElementById("zoomInBtn");

    if (addSnippetBtn) addSnippetBtn.addEventListener("click", () => { addSnippetMode(); hideEditorView(); });
    if (saveSnippetBtn) saveSnippetBtn.addEventListener("click", () => saveSnippet(snippetsDir));
    if (deleteBtn) deleteBtn.addEventListener("click", () => showAlert("Continue to delete snippet: right click to cancel", ()=>deleteSnippet(snippetsDir)));
    if (copyBtn) copyBtn.addEventListener("click", () => copyCode());
    if (zoomOutBtn) zoomOutBtn.addEventListener("click", () => zoomOut());
    if (zoomInBtn) zoomInBtn.addEventListener("click", () => zoomIn());

    const input = document.querySelector(".dropdown input");
    const options = document.querySelector('.options');

    options.addEventListener('mousedown', (e) => {
        const option = e.target.closest('.option');
        if (!option) return;
        input.value = option.textContent;
        input.dataset.value = option.dataset.value;
        input.blur();
        monaco.editor.setModelLanguage(window.editor.getModel(), getMonacoLanguage(option.dataset.value));
    });
});

startMonacoEditor(() => {
    ipcRenderer.send("editor-ready");
});

})();
