console.log("language-definitions.js loaded");
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

}

// Export for use in main.js
window.registerCustomLanguages = registerCustomLanguages;