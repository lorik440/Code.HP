// Enhanced Language Definitions for Monaco Editor - VS Code Exact Matching

function registerCustomLanguages() {
    
    // PHP Language Definition (VS Code exact color matching)
    monaco.languages.register({ id: 'php' });
    monaco.languages.setMonarchTokensProvider('php', {
        tokenizer: {
            root: [
                // PHP opening/closing tags - purple
                [/<\?php\b/, 'keyword.tag'],
                [/<\?=/, 'keyword.tag'],
                [/\?>/, 'keyword.tag'],
                
                // Superglobals - bright blue like $_SERVER, $_SESSION
                [/\$_(GET|POST|REQUEST|SESSION|COOKIE|SERVER|FILES|ENV|GLOBALS)\b/, 'variable.predefined'],
                
                // Regular variables - light blue like $sql, $stmt
                [/\$[a-zA-Z_]\w*/, 'variable'],
                
                // String literals - orange/brown color
                [/"([^"\\]|\\.)*$/, 'string.invalid'],
                [/"/, 'string', '@string_double'],
                [/'([^'\\]|\\.)*$/, 'string.invalid'],
                [/'/, 'string', '@string_single'],
                
                // Comments - green
                [/\/\*/, 'comment', '@comment'],
                [/\/\/.*$/, 'comment'],
                [/#.*$/, 'comment'],
                
                // Function calls - yellow like password_hash(), setAlert()
                [/[a-zA-Z_]\w*(?=\s*\()/, 'entity.name.function'],
                
                // Keywords - purple/magenta like if, empty, strlen
                [/\b(if|else|elseif|endif|while|for|foreach|return|function|class|new|public|private|protected|static|const|var|echo|print|include|require|namespace|use|try|catch|finally|throw|extends|implements|abstract|final|interface|trait|empty|isset|strlen|preg_match|header|exit|die|array|true|false|null)\b/, 'keyword'],
                
                // Constants and built-ins - light blue like PASSWORD_BCRYPT
                [/\b[A-Z_][A-Z0-9_]*\b/, 'constant'],
                
                // Numbers - light green
                [/\b\d+(\.\d+)?\b/, 'number'],
                
                // Operators - white/light gray
                [/->/, 'operator.arrow'],
                [/=>/, 'operator.key'],
                [/===|!==|==|!=|<=|>=|<|>/, 'operator.comparison'],
                [/&&|\|\||!/, 'operator.logical'],
                [/[+\-*\/%=]/, 'operator.arithmetic'],
                
                // Brackets and punctuation
                [/[{}()\[\]]/, '@brackets'],
                [/[;,.]/, 'delimiter'],
                
                // Array keys in brackets - orange like 'REQUEST_METHOD', 'newPassword'
                [/\['[^']*'\]/, 'key'],
                [/\["[^"]*"\]/, 'key'],
                
                // Identifiers
                [/[a-zA-Z_]\w*/, 'identifier']
            ],
            
            string_double: [
                // Variable interpolation in strings
                [/\$[a-zA-Z_]\w*/, 'variable'],
                [/[^\\"$]+/, 'string'],
                [/\\./, 'string.escape'],
                [/"/, 'string', '@pop']
            ],
            
            string_single: [
                [/[^\\']+/, 'string'],
                [/\\./, 'string.escape'],
                [/'/, 'string', '@pop']
            ],
            
            comment: [
                [/[^\/*]+/, 'comment'],
                [/\*\//, 'comment', '@pop'],
                [/[\/*]/, 'comment']
            ]
        }
    });

    // Custom theme colors to match retro-futuristic alien UI - VS Code syntax with green panel
    monaco.editor.defineTheme('vs-code-php', {
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
}

// Export for use in main.js
window.registerCustomLanguages = registerCustomLanguages;