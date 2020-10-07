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
}