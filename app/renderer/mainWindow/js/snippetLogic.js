//Snippet Logic
// This file contains the logic for adding, saving, and deleting snippets in the main window.

import {
    path,
    ipcRenderer,
    fs
} from "../../../main/deps/render-deps.js"

import {
    showAlert,
    showToast
}from "./alerts.js"

export function addSnippetMode() {
    document.querySelector(".addSnippetPanel").classList.remove("hidden");
    document.querySelector(".topMainPanel").classList.add("hidden");
    window.editor.setValue("");
}

export function defaultsnippetmode() {
    document.querySelector(".addSnippetPanel").classList.add("hidden");
    document.querySelector(".topMainPanel").classList.remove("hidden");
}

export function saveSnippet(snippetsDir) {
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

export function deleteSnippet(snippetsDir) {

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

