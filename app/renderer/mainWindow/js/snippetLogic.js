//Snippet Logic
// This file contains the logic for adding, saving, and deleting snippets in the main window.

// Import necessary modules    
import {
    path,
    ipcRenderer,
    fs
} from "../../../main/deps/render-deps.js"

// import functions for alerts 
import {
    showAlert,
    showToast
}from "./alerts.js"

// switches to add snippet mode, showing the add snippet panel and hiding the main panel
export function addSnippetMode() {
    document.querySelector(".addSnippetPanel").classList.remove("hidden");
    document.querySelector(".topMainPanel").classList.add("hidden");

    // clear monaco edditor 
    window.editor.setValue("");
}

// switches back to the default snippet mode, hiding the add snippet panel and showing the main panel
export function defaultsnippetmode() {
    document.querySelector(".addSnippetPanel").classList.add("hidden");
    document.querySelector(".topMainPanel").classList.remove("hidden");
}

// saves the current snippet to the snippets directory
export function saveSnippet(snippetsDir) {

    // get the snippet name, language, and code from the input fields and editor
    const SnippetNameInput = document.getElementById("SnippetNameInput");
    const LanguageInput = document.getElementById("LanguageInput");
    const snippetCode = window.editor.getValue();

    // validate that all the necessary inputs are filled
    if (!SnippetNameInput.value.trim() || !LanguageInput.value || !snippetCode.trim()) {
        showAlert("Fill all the inputs");
        return;
    }

    // construct the file name based on the snippet name, language, and a unique ID
    let fileName = SnippetNameInput.value.trim().replace(/\s+/g, "-");
    let extension = LanguageInput.dataset.value;

    // check for existing snippet IDs to ensure uniqueness
    const tabs = document.querySelectorAll('.tab');
    const existingIds = Array.from(tabs).map(tab => parseInt(tab.dataset.id));
    const lastId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;

    // append the unique ID to the file name
    fileName += "-" + lastId;

    // determine the file extension based on the selected language
    if (extension === 'dockerfile') {
        fileName += '';
    } else if (extension) {
        fileName += "." + extension;
    } else {
        fileName += ".txt";
    }

    // save the new snippet in the directory 
    fs.writeFileSync(path.join(snippetsDir, fileName), snippetCode, "utf8");
    defaultsnippetmode();

    // show toast notification for successful save
    showToast("snippet saved successfully");

    //reload the page after a short delay
    setTimeout(() => location.reload(), 1000);
}

// deletes the active snippet from the directory
export function deleteSnippet(snippetsDir) {

    // get the currently active tab (snippet) in the UI, check if no tab is selected to show an alert and return
    const tabActive = document.querySelector(".tab.active");
    if (!tabActive) { showToast("snippet not selected"); return; }

    // get the snippet ID, name, language, and construct the file path for deletion
    const snippetId = parseInt(tabActive.dataset.id);
    const snippetName = tabActive.querySelector('.snippetName').textContent;
    const snippetLanguage = tabActive.querySelector('.snippetLanguage').textContent;
    const filePath = path.join(snippetsDir, `${snippetName}-${snippetId}.${snippetLanguage}`);

    // attempt to delete the snippet file from the filesystem 
    try {
        fs.unlinkSync(filePath);

        //remove the tab from the UI
        tabActive.remove();

        // clear monaco editor
        if (window.editor) window.editor.setValue('');

        //set snippet name and snippet language to empty string in the top main panel
        const TMP_snippetName = document.getElementById("snippetName_TMP");
        const TMP_language = document.getElementById("language_TMP");
        if (TMP_snippetName) TMP_snippetName.textContent = '';
        if (TMP_language) TMP_language.textContent = '';

        //show a success toast
        showToast("snippet deleted successfully");

        //If an error occurs during deletion, show an error toast
    } catch (error) {
        showToast("error deleting snippet");
    }
}

