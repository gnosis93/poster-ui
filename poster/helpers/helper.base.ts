//importing necessary modules
import * as path from 'path';

export class BaseHelper{

    public static getPostsDir(){
        const homedir = this.getMainContentPath();
        let dirPath   = path.join(homedir, 'posts');
        return dirPath;
    }
    

    public static getMainContentPath(){
        const {app}   = require('electron');
        const userData = app.getPath('userData');
        return userData;
    }

        /**
     * Helper function to delay the process , used to await loading of elements/html 
     * @param time time in miliseconds 
     */
    protected static async delay(time:number) : Promise<void>{//inherited
        return new Promise(function(resolve) { 
            setTimeout(resolve, time)
        });
    }
}