// tab machanizm///////////////////////////////////////////////////////////////////////////

const nodeRequire = window.nodeRequire || window.require || require;
window.nodeRequire = nodeRequire;
const path = nodeRequire('path');
const { pathToFileURL } = nodeRequire('url');
const snippetsDir = path.resolve(process.cwd(), 'snippets');

document.addEventListener('DOMContentLoaded', ()=>{
   const fs = nodeRequire('fs');
   const files = fs.readdirSync(snippetsDir);

    //gets snippets form folder
    const snippets =files.map(filename=>{
        const parsed =path.parse(filename);
        const parts =parsed.name.split('-');
        const id=parts[parts.length -1];
        const name = parts.slice(0, -1).join('-');
        return {
            id: parseInt(id),
            name: name,
            language:parsed.ext.slice(1)
        }

    }) ;

    //adds tabs from snippet folder
    const tabSpace =document.getElementById('tabSpace');
    
    const tabsHTML = snippets.map(snip => `
        <div class="tab" data-id="${snip.id}">
            <span class="snippetName">${snip.name}</span> 
            <span class="snippetLanguage">${snip.language}</span>
        </div>
    `).join('');
    
    tabSpace.innerHTML = tabsHTML;

    //checkbox mekanizm for tabs
    const tabs =document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click',()=>{

            //sets  the panel to default mode 
            defaultsnippetmode();

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            //load file content into to code panel
            const snippetId = parseInt(tab.dataset.id);
            const snippet = snippets.find(s => s.id === snippetId);
            const fileName = `${snippet.name}-${snippet.id}.${snippet.language}`;
            const filePath = path.join(snippetsDir, fileName);
            const fileContent = fs.readFileSync(filePath, 'utf8');

            //paste snippet name & language on the code top panel
            const TMP_snippetName = document.getElementById("snippetName_TMP");
            const TMP_language =document.getElementById("language_TMP");
            TMP_snippetName.textContent = `${snippet.name}`;
            TMP_language.textContent = `${snippet.language}`;
            
            //paste the snippet code to the code panel
            window.editor.setValue(fileContent);
            const MonacoLanguage = getMonacoLanguage(snippet.language);
            monaco.editor.setModelLanguage(window.editor.getModel(), MonacoLanguage);
        });

    });

    // Search functionality for snippets
    const searchBar = document.getElementById("SearchSnippet");
    searchBar.addEventListener("input", () => {
        const searchBarInput = searchBar.value.toLowerCase();
        
        if (searchBarInput === "") {
            // Show all tabs when search is empty
            tabs.forEach(tab => {
                tab.style.display = "";
            });
        } else {
            // Filter tabs based on search
            tabs.forEach(tab => {
                const snippetName = tab.querySelector(".snippetName").textContent.toLowerCase();
                if (snippetName.includes(searchBarInput)) {
                    tab.style.display = "";
                } else {
                    tab.style.display = "none";
                }
            });
        }
    });

    
});



/////////////////////////////////////////////////////////////////////////////////////////.


//snippet insertion mechanizm/////////////////////////////////////////////////////////////

//toggel add snippet mode
function addSippetMode(){
    const addSippetpanel =document.querySelector(".addSnippetPanel");
    const defaultPanel =document.querySelector(".topMainPanel");

    //clears the code panel to prepare for new snippet
    window.editor.setValue("");

    //swtches the top pnale for add snippet view
    defaultPanel.classList.add("hidden");
    addSippetpanel.classList.remove("hidden");
};

//toggel default Panel mode
function defaultsnippetmode(){
    const addSippetpanel =document.querySelector(".addSnippetPanel");
    const defaultPanel =document.querySelector(".topMainPanel");

    //switches the top panel to default panel view
    defaultPanel.classList.remove("hidden");
    addSippetpanel.classList.add("hidden");   
};



//snippet language selector dropdown
const input=document.querySelector(".dropdown input");
const options=document.querySelectorAll(".dropdown .option");

options.forEach(option =>{
    option.addEventListener("mousedown",()=>{
        input.value =option.textContent;
        input.dataset.value=option.dataset.value;
        input.blur();

        //sets the code panel language for writing the snippet 
        const MonacoLanguage = getMonacoLanguage(option.dataset.value);
        const model =window.editor.getModel();
        monaco.editor.setModelLanguage(model, MonacoLanguage);
    });

});

function saveSnippet(){
    const fs = nodeRequire('fs');

    //get the name, language, and code from the code panel
    const SnippetNameInput=document.getElementById("SnippetNameInput");
    const LanguageInput =document.getElementById("LanguageInput");
    const snippetCode= window.editor.getValue();

    //check if the inputs are not empty
    if(!SnippetNameInput.value.trim() || !LanguageInput.value || !snippetCode.trim()){
        showAlert("Fill all the inputs");
        return;
    };

    //saving the file to the snippet folder//

    //converting snippet language and name to the proper format
    let fileName = SnippetNameInput.value.trim().replace(/\s+/g, "-");
    let extension = LanguageInput.dataset.value;

    //get the highest ID from existing tabs and increment
    const tabs = document.querySelectorAll('.tab');
    const existingIds = Array.from(tabs).map(tab => parseInt(tab.dataset.id));
    const lastId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;

    fileName += "-" + lastId;
    
    // Handle special cases for file extensions
    if (extension === 'dockerfile') {
        // Dockerfile typically has no extension
        fileName += '';
    } else if (extension) {
        fileName += "." + extension;
    } else {
        // Fallback to .txt if no extension
        fileName += ".txt";
    }

    const folderPath = snippetsDir;

    const filePath = path.join(folderPath, fileName);
    fs.writeFileSync(filePath, snippetCode, "utf8");
    
    defaultsnippetmode();
    showToast("snippet saved successfully");
    
   

    // Reload after showing the toast
    setTimeout(() => {
        location.reload();

    }, 1000);
    
}


///////////////////////////////////////////////////////////////////////////////////.


//other functions//////////////////////////////////////////////////////////////////// 


// Copy to clipboard function
function copyCode() {
    if (window.editor) {
        const code = window.editor.getValue();
        navigator.clipboard.writeText(code);
        showToast("copied")
    }
}


//add message toast
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
    
    setTimeout(() => {
        document.body.removeChild(toast);
    }, 2000);
}

// function to show an alert
function showAlert(text, callback ){
    const message =document.querySelector(".message");
    const parentDiv=document.querySelector(".parent");

    parentDiv.classList.add("blur");
    message.textContent=text;
    message.classList.remove("hidden");

    
    message.addEventListener("click",()=>{
        if(!callback){
            parentDiv.classList.remove("blur");
            message.textContent="";
            message.classList.add("hidden");
            return;
        }
        if(callback){

            parentDiv.classList.remove("blur");
            message.textContent="";
            message.classList.add("hidden");

            callback();
            return;
        }
    },{once: true});

    message.addEventListener("contextmenu",()=>{
        parentDiv.classList.remove("blur");
        message.textContent="";
        message.classList.add("hidden");
        return;
    })
    
    
    
};  
    
// function to delete a snippet
function deleteSnippet(){
    const tabActive =document.querySelector(".tab.active");

    if(!tabActive){
        showToast("snippet not selected");
        return;
    }else{

        const fs = nodeRequire('fs');
        
        // Get the active tab and snippet info
        const snippetId = parseInt(tabActive.dataset.id);
        const snippetName = tabActive.querySelector('.snippetName').textContent;
        const snippetLanguage = tabActive.querySelector('.snippetLanguage').textContent;
        
        // Construct the filename
        const fileName = `${snippetName}-${snippetId}.${snippetLanguage}`;
        const filePath = path.join('./snippets', fileName);
        
        try {
            // Delete the file
            fs.unlinkSync(filePath);
            
            // Remove the tab from the UI
            tabActive.remove();
            
            // Clear the editor
            if (window.editor) {
                window.editor.setValue('');
            }
            
            // Clear the top panel info
            const TMP_snippetName = document.getElementById("snippetName_TMP");
            const TMP_language = document.getElementById("language_TMP");
            if (TMP_snippetName) TMP_snippetName.textContent = '';
            if (TMP_language) TMP_language.textContent = '';
            
            showToast("snippet deleted successfully");
            
        } catch (error) {
            console.error('Error deleting file:', error);
            showToast("error deleting snippet");
        }
    }

};




///////////////////////////////////////////////////////////////////////.



//Code editor panel ////////////////////////////////////////////////////

const monacoBasePath = path.resolve(__dirname, '..', '..', 'node_modules', 'monaco-editor', 'min', 'vs');
const monacoBaseUrl = `${pathToFileURL(monacoBasePath).href}/`;

window.MonacoEnvironment = {
    baseUrl: monacoBaseUrl
};

require.config({
    paths: {
        vs: monacoBaseUrl
    }
});

require(['vs/editor/editor.main'], function () {
    // Load custom language definitions
    if (typeof registerCustomLanguages === 'function') {
        registerCustomLanguages();
    }
    
    window.editor = monaco.editor.create(
        document.getElementById('editorPanel'),
        {
            value: '',
            language: 'javascript',
            theme: 'vs-code-php',
            automaticLayout: true,
            lineNumbersMinChars: 0,
            glyphMargin: false,
            folding: false,
            lineDecorationsWidth: 10,
            fontSize: 14,
            fontFamily: 'VT323, monospace',
            fontLigatures: false,
            lineHeight: 18,
            letterSpacing: 0,
            renderLineHighlightOnlyWhenFocus: true,
            scrollBeyondLastLine: false,
            minimap: { enabled: false },
            contextmenu: true
        }
    );
    
    // Add custom clipboard commands that work in Electron
    window.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyV, function() {
        navigator.clipboard.readText().then(text => {
            const selection = window.editor.getSelection();
            const op = {
                range: selection,
                text: text,
                forceMoveMarkers: true
            };
            window.editor.executeEdits('paste', [op]);
            window.editor.focus();
        });
    });
    
    window.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyC, function() {
        const selection = window.editor.getSelection();
        const text = window.editor.getModel().getValueInRange(selection);
        if (text) {
            navigator.clipboard.writeText(text);
        }
    });
    
    window.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyX, function() {
        const selection = window.editor.getSelection();
        const text = window.editor.getModel().getValueInRange(selection);
        if (text) {
            navigator.clipboard.writeText(text);
            window.editor.executeEdits('cut', [{
                range: selection,
                text: '',
                forceMoveMarkers: true
            }]);
        }
    });
});

//language library for monaco editor 
function getMonacoLanguage(extension) {

    const languageMap = {

        js: "javascript",
        jsx: "javascript",
        ts: "typescript",
        tsx: "typescript",

        html: "html",
        css: "css",
        scss: "scss",
        sass: "scss",
        less: "less",

        json: "json",
        jsonc: "json",
        xml: "xml",
        yaml: "yaml",
        yml: "yaml",

        py: "python",
        java: "java",
        c: "c",
        h: "c",
        cpp: "cpp",
        hpp: "cpp",
        cs: "csharp",

        php: "php",
        rb: "ruby",
        go: "go",
        rs: "rust",
        swift: "swift",
        kt: "kotlin",
        dart: "dart",
        scala: "scala",
        fs: "fsharp",

        sql: "sql",

        sh: "shell",
        bash: "shell",
        ps1: "powershell",
        bat: "bat",
        cmd: "bat",

        md: "markdown",
        txt: "plaintext",

        dockerfile: "dockerfile",
        ini: "ini",
        toml: "ini",

        graphql: "graphql",
        gql: "graphql",

        lua: "lua",
        r: "r",
        perl: "perl"
    };

    return languageMap[extension.toLowerCase()] || "plaintext";
}

// Monaco editor zoom functions
function zoomIn() {
    if (window.editor) {
        const currentSize = window.editor.getOption(monaco.editor.EditorOption.fontSize);
        window.editor.updateOptions({ fontSize: currentSize + 1 });
    }
}

function zoomOut() {
    if (window.editor) {
        const currentSize = window.editor.getOption(monaco.editor.EditorOption.fontSize);
        if (currentSize > 8) { // Minimum font size
            window.editor.updateOptions({ fontSize: currentSize - 1 });
        }
    }
}


////////////////////////////////////////////////////////////////////////////.