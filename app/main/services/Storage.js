const { app } = require("electron");
const path = require("path");
const fs = require("fs");


class Storage {

    constructor(){

        this.snippetsDir = null;

    }


    async initialize(){

        this.snippetsDir = path.join(
            app.getPath("userData"),
            "snippets"
        );


        if(!fs.existsSync(this.snippetsDir)){

            fs.mkdirSync(
                this.snippetsDir,
                {
                    recursive: true
                }
            );

        }


        console.log(
            `[Storage] Snippets directory: ${this.snippetsDir}`
        );

    }


    getSnippetsDir(){

        return this.snippetsDir;

    }

}


module.exports = new Storage();