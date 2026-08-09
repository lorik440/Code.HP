const {
    setSplashWindow,
    log
} = require("../services/Logger.js");

const { getAppVersion, getMonacoBaseUrl } = require("../services/IpcHandler.js");
const setStoragePath =require("../services/StoragePath.js")
const createSplash =require("../windows/SplashWindow.js");
const updater = require("../services/Updater.js");
const setShortcut =require("../services/Shortcut.js");
const createWindow =require("../windows/MainWindow.js");
const tryShowMainWindow = require("../services/Launch.js");

class Kernel {

    constructor(){
        this.context ={
            mainWindow:null,
            splashWindow:null,

            updateFinished:false,
            editorReady:false

        }
    }

    //
    async start(){

        await this.runStep("confirming app version",
            async()=>{
                getAppVersion();
                getMonacoBaseUrl();
            }
        )

        await this.runStep("splash window",
            async()=>{
                this.context.splashWindow=await createSplash();
                
                setSplashWindow(
                    this.context.splashWindow
                );
            }
           
        )

        await this.runStep("initialize storage path",
            async()=>{
                setStoragePath();
                
            }, false
        )

        await this.runStep("updater",
            async()=>{
                await new Promise((resolve) => {
                    updater(this, resolve);
                });
            }
        )
        await this.runStep("activating hotkey",
            async()=>{
                setShortcut(this);

            }
        )
        await this.runStep("editor ready", async () => {
            await new Promise((resolve) => {
                createWindow(this, resolve);
            });
        });

        log("Code.HP ready", "success", "launch");

    
    }
    //
    async runStep(name, action, required=true){
        log(
            `${name}`,
            "loading",
            name
        );

        try {
           await action();

            log(
                `${name}`,
                "success",
                name
            );

        } catch(error) {

            if(!required){
                log(
                    `${name} — ${error.message}`,
                    "failed",
                    name
                );
            }

            if(required){
                log(`${name} — required module failed`, "failed", name);
                throw error;
            }

        }

    }


    tryShow(){
        tryShowMainWindow(this);
    }

    shutdown(){
        log("kenral shutdown", "loading");
        try{

        }catch{

        }
    }

}
 
module.exports= new Kernel();

