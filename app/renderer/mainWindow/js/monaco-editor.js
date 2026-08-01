import { ipcRenderer } from "../../../main/deps/render-deps.js";
import { registerCustomLanguages } from "./language-definitions.js";

export async function startMonacoEditor(onReady) {
    const monacoBaseUrl = await ipcRenderer.invoke("get-monaco-base-url");

    window.MonacoEnvironment = { baseUrl: monacoBaseUrl };

    require.config({ paths: { vs: monacoBaseUrl } });

    require(['vs/editor/editor.main'], function () {

        monaco.editor.defineTheme('vs-code-alien', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: 'variable', foreground: '9CDCFE' },
                { token: 'variable.predefined', foreground: '4FC1FF' },
                { token: 'string', foreground: 'CE9178' },
                { token: 'string.escape', foreground: 'D7BA7D' },
                { token: 'keyword', foreground: 'C586C0' },
                { token: 'keyword.tag', foreground: 'C586C0' },
                { token: 'entity.name.function', foreground: 'DCDCAA' },
                { token: 'constant', foreground: '4FC1FF' },
                { token: 'number', foreground: 'B5CEA8' },
                { token: 'comment', foreground: '6A9955' },
                { token: 'operator.arrow', foreground: 'D4D4D4' },
                { token: 'operator.key', foreground: 'D4D4D4' },
                { token: 'operator.comparison', foreground: 'D4D4D4' },
                { token: 'operator.logical', foreground: 'D4D4D4' },
                { token: 'operator.arithmetic', foreground: 'D4D4D4' },
                { token: 'key', foreground: 'CE9178' },
                { token: 'delimiter', foreground: 'D4D4D4' },
                { token: 'identifier', foreground: 'D4D4D4' },
            ],
            colors: {
                'editor.background': '#0A120A',
                'editor.foreground': '#D4D4D4',
                'editorLineNumber.foreground': '#4A5A4A',
                'editorLineNumber.activeForeground': '#7FFF7F',
                'editor.selectionBackground': '#1A3A1A',
                'editor.selectionHighlightBackground': '#0F2F0F',
                'editor.wordHighlightBackground': '#2A4A2A',
                'editor.wordHighlightStrongBackground': '#1A3A1A',
                'editorCursor.foreground': '#00FF7F',
                'editor.lineHighlightBackground': '#0F1F0F',
                'editorGutter.background': '#0A120A',
                'editorWidget.background': '#0F1F0F',
                'editorWidget.border': '#2A4A2A'
            }
        });

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

        window.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyV, function () {
            navigator.clipboard.readText().then(text => {
                const selection = window.editor.getSelection();
                window.editor.executeEdits('paste', [{ range: selection, text: text, forceMoveMarkers: true }]);
                window.editor.focus();
            });
        });

        window.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyC, function () {
            const text = window.editor.getModel().getValueInRange(window.editor.getSelection());
            if (text) navigator.clipboard.writeText(text);
        });

        window.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyX, function () {
            const selection = window.editor.getSelection();
            const text = window.editor.getModel().getValueInRange(selection);
            if (text) {
                navigator.clipboard.writeText(text);
                window.editor.executeEdits('cut', [{ range: selection, text: '', forceMoveMarkers: true }]);
            }
        });

        if (onReady) onReady();
    });
}

export function getMonacoLanguage(extension) {
    const languageMap = {
        js: "javascript", jsx: "javascript", ts: "typescript", tsx: "typescript",
        html: "html", css: "css", scss: "scss", sass: "scss", less: "less",
        json: "json", jsonc: "json", xml: "xml", yaml: "yaml", yml: "yaml",
        py: "python", java: "java", c: "c", h: "c", cpp: "cpp", hpp: "cpp", cs: "csharp",
        php: "php", rb: "ruby", go: "go", rs: "rust", swift: "swift", kt: "kotlin",
        dart: "dart", scala: "scala", fs: "fsharp", sql: "sql",
        sh: "shell", bash: "shell", ps1: "powershell", bat: "bat", cmd: "bat",
        md: "markdown", txt: "plaintext", dockerfile: "dockerfile", ini: "ini", toml: "ini",
        graphql: "graphql", gql: "graphql", lua: "lua", r: "r", perl: "perl"
    };
    return languageMap[extension.toLowerCase()] || "plaintext";
}

export function zoomIn() {
    if (window.editor) {
        window.editor.updateOptions({ fontSize: window.editor.getOption(monaco.editor.EditorOption.fontSize) + 1 });
    }
}

export function zoomOut() {
    if (window.editor) {
        const size = window.editor.getOption(monaco.editor.EditorOption.fontSize);
        if (size > 8) window.editor.updateOptions({ fontSize: size - 1 });
    }
}

export function hideEditorView() {
    const editorView = document.querySelector('.editorView');
    if (editorView) editorView.style.display = 'none';
}
