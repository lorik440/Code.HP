const { globalShortcut } = require("electron");
const { BrowserWindow } = require("../deps/main.deps");
const path = require("path");


class MainWindow{

    constructor(){
        this.window = null;
    }


    async create(){

        this.window = new BrowserWindow({
            width:500,
            height:400,
            minWidth:480,
            minHeight:380,
            show:false,
            icon:path.join(__dirname,"..","assets","icon.ico"),
            alwaysOnTop:true,
            autoHideMenuBar:true,
            resizable:true,
            backgroundColor:"#121715",
            webPreferences:{
                nodeIntegration:true,
                contextIsolation:false,
                webSecurity:true,
                allowRunningInsecureContent:false
            }
        });


        await this.window.loadFile(
            path.join(
                __dirname,
                "..",
                "..",
                "renderer",
                "index.html"
            )
        );


        this.registerShortcut();


        return this.window;
    }


    registerShortcut(){

        const registered = globalShortcut.register(
            "Ctrl+Alt+Space",
            ()=>{

                if(
                    !this.window ||
                    this.window.isDestroyed()
                ){
                    return;
                }


                if(this.window.isVisible()){

                    this.window.hide();

                }else{

                    this.window.show();
                    this.window.focus();

                }

            }
        );


        if(!registered){
            console.warn(
                "Global shortcut registration failed."
            );
        }

    }


    unregisterShortcut(){

        globalShortcut.unregister(
            "Ctrl+Alt+Space"
        );

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


module.exports = new MainWindow();