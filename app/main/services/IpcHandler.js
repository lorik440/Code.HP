const { app, ipcMain } = require("electron");

function getAppVersion(){
        ipcMain.handle("get-app-version", () => {
        return app.getVersion();
    });
}

function confirmEditor(kernel){
     ipcMain.once("editor-ready", () => {

        kernel.context.editorReady=true;

    });
}


module.exports={getAppVersion, confirmEditor}
