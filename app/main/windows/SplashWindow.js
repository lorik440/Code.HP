const {BrowserWindow} =require('electron');
const path = require('path');

class SplashWindow{

    constructor(){
        this.window =null;
    }

    async create(){
        this.window = new BrowserWindow({
                width: 400,
                height: 300,
                frame: false,
                resizable: false,
                minimizable: false,
                maximizable: false,
                movable: true,
                alwaysOnTop: true,
                autoHideMenuBar: true,
                backgroundColor: "#121715",
                icon: path.join(__dirname, "..", "assets", "icon.ico"),
                webPreferences: {
                    nodeIntegration: true,
                    contextIsolation: false
                }
            });
        
            await this.window.loadFile(
                path.join(__dirname, "..","..", "renderer", "splash.html")
            );
            return this.window;
    }
    sendMessage(message, status){
        if (
            this.window && !this.window.isDestroyed()
        ){
            this.window.webContents.send(
                "splash-message",
                {
                    message,
                    status
                }
            )
        }
    }

    close(){
        if(this.window && !this.window.isDestroyed()){
            this.window.close();
        }
    }
    getWindow(){
        return this.window;
    }

}
module.exports = new SplashWindow();