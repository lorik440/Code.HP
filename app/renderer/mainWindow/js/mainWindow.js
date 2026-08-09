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
    hideEditorView
} from "./monaco-editor.js";

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
    if (saveSnippetBtn) saveSnippetBtn.addEventListener("click", () => saveSnippet());
    if (deleteBtn) deleteBtn.addEventListener("click", () => showAlert("Continue to delete snippet: right click to cancel", deleteSnippet));
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

function addSnippetMode() {
    document.querySelector(".addSnippetPanel").classList.remove("hidden");
    document.querySelector(".topMainPanel").classList.add("hidden");
    window.editor.setValue("");
}

function defaultsnippetmode() {
    document.querySelector(".addSnippetPanel").classList.add("hidden");
    document.querySelector(".topMainPanel").classList.remove("hidden");
}

function saveSnippet() {
    const SnippetNameInput = document.getElementById("SnippetNameInput");
    const LanguageInput = document.getElementById("LanguageInput");
    const snippetCode = window.editor.getValue();

    if (!SnippetNameInput.value.trim() || !LanguageInput.value || !snippetCode.trim()) {
        showAlert("Fill all the inputs");
        return;
    }

    let fileName = SnippetNameInput.value.trim().replace(/\s+/g, "-");
    let extension = LanguageInput.dataset.value;

    const tabs = document.querySelectorAll('.tab');
    const existingIds = Array.from(tabs).map(tab => parseInt(tab.dataset.id));
    const lastId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;

    fileName += "-" + lastId;

    if (extension === 'dockerfile') {
        fileName += '';
    } else if (extension) {
        fileName += "." + extension;
    } else {
        fileName += ".txt";
    }

    fs.writeFileSync(path.join(snippetsDir, fileName), snippetCode, "utf8");
    defaultsnippetmode();
    showToast("snippet saved successfully");
    setTimeout(() => location.reload(), 1000);
}

function showToast(text) {
    const toast = document.createElement('div');
    toast.textContent = text;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 50%;
        background: var(--alert-confirm-color);
        border:1px solid var(--border-color);
        color: white;
        padding: 5px 8px;
        font-size:small;
        border-radius: 4px;
        z-index: 1000;
    `;
    document.body.appendChild(toast);
    setTimeout(() => document.body.removeChild(toast), 2000);
}

function showAlert(text, callback) {
    const message = document.querySelector(".message");
    const parentDiv = document.querySelector(".parent");

    parentDiv.classList.add("blur");
    message.textContent = text;
    message.classList.remove("hidden");

    message.addEventListener("click", () => {
        parentDiv.classList.remove("blur");
        message.textContent = "";
        message.classList.add("hidden");
        if (callback) callback();
    }, { once: true });

    message.addEventListener("contextmenu", () => {
        parentDiv.classList.remove("blur");
        message.textContent = "";
        message.classList.add("hidden");
    });
}

function copyCode() {
    if (window.editor) {
        navigator.clipboard.writeText(window.editor.getValue());
        showToast("copied");
    }
}

function deleteSnippet() {
    const tabActive = document.querySelector(".tab.active");
    if (!tabActive) { showToast("snippet not selected"); return; }

    const snippetId = parseInt(tabActive.dataset.id);
    const snippetName = tabActive.querySelector('.snippetName').textContent;
    const snippetLanguage = tabActive.querySelector('.snippetLanguage').textContent;
    const filePath = path.join(snippetsDir, `${snippetName}-${snippetId}.${snippetLanguage}`);

    try {
        fs.unlinkSync(filePath);
        tabActive.remove();
        if (window.editor) window.editor.setValue('');
        const TMP_snippetName = document.getElementById("snippetName_TMP");
        const TMP_language = document.getElementById("language_TMP");
        if (TMP_snippetName) TMP_snippetName.textContent = '';
        if (TMP_language) TMP_language.textContent = '';
        showToast("snippet deleted successfully");
    } catch (error) {
        showToast("error deleting snippet");
    }
}

startMonacoEditor(() => {
    ipcRenderer.send("editor-ready");
});

})();
