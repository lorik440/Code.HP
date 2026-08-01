// Enhanced Language Definitions for Monaco Editor - VS Code Exact Matching

export function registerCustomLanguages() {
    
    monaco.languages.register({ id: 'php' });
    monaco.languages.setMonarchTokensProvider('php', {
        tokenizer: {
            root: [
                [/<\?php\b/, 'keyword.tag'],
                [/<\?=/, 'keyword.tag'],
                [/\?>/, 'keyword.tag'],
                [/\$_(GET|POST|REQUEST|SESSION|COOKIE|SERVER|FILES|ENV|GLOBALS)\b/, 'variable.predefined'],
                [/\$[a-zA-Z_]\w*/, 'variable'],
                [/"([^"\\]|\\.)*$/, 'string.invalid'],
                [/"/, 'string', '@string_double'],
                [/'([^'\\]|\\.)*$/, 'string.invalid'],
                [/'/, 'string', '@string_single'],
                [/\/\*/, 'comment', '@comment'],
                [/\/\/.*$/, 'comment'],
                [/#.*$/, 'comment'],
                [/[a-zA-Z_]\w*(?=\s*\()/, 'entity.name.function'],
                [/\b(if|else|elseif|endif|while|for|foreach|return|function|class|new|public|private|protected|static|const|var|echo|print|include|require|namespace|use|try|catch|finally|throw|extends|implements|abstract|final|interface|trait|empty|isset|strlen|preg_match|header|exit|die|array|true|false|null)\b/, 'keyword'],
                [/\b[A-Z_][A-Z0-9_]*\b/, 'constant'],
                [/\b\d+(\.\d+)?\b/, 'number'],
                [/->/, 'operator.arrow'],
                [/=>/, 'operator.key'],
                [/===|!==|==|!=|<=|>=|<|>/, 'operator.comparison'],
                [/&&|\|\||!/, 'operator.logical'],
                [/[+\-*\/%=]/, 'operator.arithmetic'],
                [/[{}()\[\]]/, '@brackets'],
                [/[;,.]/, 'delimiter'],
                [/\['[^']*'\]/, 'key'],
                [/\["[^"]*"\]/, 'key'],
                [/[a-zA-Z_]\w*/, 'identifier']
            ],
            string_double: [
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
