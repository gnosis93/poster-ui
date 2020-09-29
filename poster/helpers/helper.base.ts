//importing necessary modules
import * as fs from 'fs';
import * as path from 'path';

export class BaseHelper{

    public static getPostsDir(){
        const {app}   = require('electron');
        const homedir = app.getPath('userData');
        let dirPath   = path.join(homedir, 'posts');
        return dirPath;
    }
    
}