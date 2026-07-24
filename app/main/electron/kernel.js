class Kernel {

    constructor(){

        this.modules = {};

    }


    initialize(modules){

        this.modules = modules;

    }


    log(message, status){

        console.log(
            `[Kernel] ${message} - ${status}`
        );

        if(this.modules.splash){

            this.modules.splash.sendMessage(
                message,
                status
            );

        }

    }


    async runStep(name, task){

        this.log(
            name,
            "loading"
        );

        try{

            await task();

            this.log(
                name,
                "success"
            );


        }catch(error){

            this.log(
                `${name}: ${error.message}`,
                "failed"
            );

            throw error;
        }

    }



    async boot(){

    try{


        await this.runStep(
            "Creating splash",
            ()=>this.modules.splash.create()
        );


        await this.runStep(
            "Initializing storage",
            ()=>this.modules.storage.initialize()
        );


        await this.runStep(
            "Creating main window",
            ()=>this.modules.mainWindow.create()
        );


        await this.runStep(
            "Checking updates",
            ()=>this.modules.updater.check(
                this.modules.splash
            )
        );


        this.log(
            "System ready",
            "success"
        );


    }catch(error){

        this.log(
            "Kernel stopped: " + error.message,
            "failed"
        );

        console.error(error);

    }

}

}

module.exports = new Kernel();