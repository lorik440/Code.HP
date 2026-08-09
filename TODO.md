## bug fixes
- [x] fix deleteSnippet() function in monaco-editor.js not loading showAlert() function in notify.js
- [x] fix: normalize Kernel.js filename casing
- [x] fix: removed loader.js retracted using old architecture for the mainWindow.html
- [x] fix: resolve monaco path via IPC, fix splash loading status display, improve updater flow and timeout handling





## Improvements
- [x] reduece the number of eventlisteners in mainWindow.js
- [x] create kernel.js to controle the workflow of the app
- [x] create a better structure for the renderer environment
- [x] module import/export structure for better code management
- [] improve IPC structure
- [] organize the code in mainWindow.js 
- [] make kernel be the source of truth for the logs shown in splash screen.


## Features
- [] add animations and tweek ui to fit the theme more 
    - [x] styled flash window/ added animation and structured the html page...
- [] add a better way to manage the snippets and their data, maybe a database or json file.     
- [] add snippets folders and folder organization for better management
- [] add edit snippet functionality
- [] add tags and favorite functionality.
- [] add most used dynamic snippet list.
- [] add different themes for the ui
