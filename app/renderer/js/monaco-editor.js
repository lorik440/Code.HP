//Code editor panel ////////////////////////////////////////////////////

import {
    nodeRequire,
    path,
    pathToFileURL,
    ipcRenderer,
    fs
} from "../../main/electron-deps.js"

import { registerCustomLanguages } from "./language-definitions.js";


export function startMonacoEditor(onReady) {
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

        // Custom theme colors to match retro-futuristic alien UI - VS Code syntax with green panel
        monaco.editor.defineTheme('vs-code-alien', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                // Keep original VS Code syntax colors
                { token: 'variable', foreground: '9CDCFE' },              // Light blue for $variables
                { token: 'variable.predefined', foreground: '4FC1FF' },   // Bright blue for $_SESSION, $_SERVER
                { token: 'string', foreground: 'CE9178' },                // Orange/brown for strings
                { token: 'string.escape', foreground: 'D7BA7D' },         // Light orange for escapes
                { token: 'keyword', foreground: 'C586C0' },               // Purple for keywords
                { token: 'keyword.tag', foreground: 'C586C0' },           // Purple for PHP tags
                { token: 'entity.name.function', foreground: 'DCDCAA' }, // Yellow for function calls
                { token: 'constant', foreground: '4FC1FF' },              // Light blue for constants
                { token: 'number', foreground: 'B5CEA8' },                // Light green for numbers
                { token: 'comment', foreground: '6A9955' },               // Green for comments
                
                // Keep original operator colors
                { token: 'operator.arrow', foreground: 'D4D4D4' },        // Light gray for ->
                { token: 'operator.key', foreground: 'D4D4D4' },          // Light gray for =>
                { token: 'operator.comparison', foreground: 'D4D4D4' },   // Light gray for ==, ===
                { token: 'operator.logical', foreground: 'D4D4D4' },      // Light gray for &&, ||
                { token: 'operator.arithmetic', foreground: 'D4D4D4' },   // Light gray for +, -, etc.
                
                // Keep original general colors
                { token: 'key', foreground: 'CE9178' },                   // Orange for array keys
                { token: 'delimiter', foreground: 'D4D4D4' },             // Light gray for punctuation
                { token: 'identifier', foreground: 'D4D4D4' },            // Light gray for identifiers
            ],
            colors: {
                // Green tinted panel background and UI elements
                'editor.background': '#0A120A',                           // Dark green-tinted background
                'editor.foreground': '#D4D4D4',                           // Keep original text color
                'editorLineNumber.foreground': '#4A5A4A',                 // Dark green line numbers
                'editorLineNumber.activeForeground': '#7FFF7F',           // Bright green active line number
                'editor.selectionBackground': '#1A3A1A',                  // Dark green selection
                'editor.selectionHighlightBackground': '#0F2F0F',         // Darker green selection highlight
                'editor.wordHighlightBackground': '#2A4A2A',              // Medium green word highlight
                'editor.wordHighlightStrongBackground': '#1A3A1A',        // Dark green strong highlight
                'editorCursor.foreground': '#00FF7F',                     // Neon green cursor
                'editor.lineHighlightBackground': '#0F1F0F',              // Very dark green line highlight
                'editorGutter.background': '#0A120A',                     // Green-tinted gutter
                'editorWidget.background': '#0F1F0F',                     // Green-tinted widgets
                'editorWidget.border': '#2A4A2A'                          // Green widget borders
            }
        });

        // Load custom language definitions
        registerCustomLanguages();
        
        window.editor = monaco.editor.create(
            document.getElementById('editorPanel'),
            {
                value: '',
                language: 'javascript',
                theme: 'vs-code-alien',
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
                    text: ' ',
                    forceMoveMarkers: true
                }]);
            }
        });

     if (onReady){
        onReady();
     }
    });

}
    //language library for monaco editor 

export function getMonacoLanguage(extension) {

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
export function zoomIn() {
    if (window.editor) {
        const currentSize = window.editor.getOption(monaco.editor.EditorOption.fontSize);
        window.editor.updateOptions({ fontSize: currentSize + 1 });
    }
}
export function zoomOut() {
    if (window.editor) {
        const currentSize = window.editor.getOption(monaco.editor.EditorOption.fontSize);
        if (currentSize > 8) { // Minimum font size
            window.editor.updateOptions({ fontSize: currentSize - 1 });
        }
    }
}

//hide logo and start up monaco editor view
export function hideEditorView() {
    const editorView=document.querySelector('.editorView');
    editorView.style.display = 'none';
}
